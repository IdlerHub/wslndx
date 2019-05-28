//base64
import { Base64 } from "utils/base64.js"
/*添加async await*/
import regeneratorRuntime from "wx-promise-pro"
/*添加微信官方接口转化为promise*/
const wxpro = require("wx-promise-pro")
/*埋点统计*/
const ald = require("./utils/ald-stat.js")
/* 全局状态管理 */
import store from "./store"

//app.js
App({
  API_URL: "https://apielb.jinlingkeji.cn/api/v2/", //正式域名：https://apielb.jinlingkeji.cn   开发域名：https://develop.jinlingkeji.cn/api/v1/
  //工具库
  util: require("utils/util.js"),
  md5: require("utils/md5.js"),
  //接口
  classroom: require("data/Classroom.js"),
  user: require("data/User.js"),
  video: require("data/Video.js"),
  circle: require("data/Circle.js"),
  // Base64
  base64: Base64,
  store,
  onLaunch: async function(opts) {
    /* 检查版本更新 */
    this.checkVersion()
    /* 签到状态 */
    this.initSignIn()
    /* 检查用户是否时分享卡片进来 */
    if (this.globalData.scenes.indexOf(opts.scene) >= 0) {
      this.globalData.path = "/" + opts.path /* 卡片页面路径 */
      this.globalData.query = opts.query /* 卡片页面参数 */
      if (opts.query.type == "invite") {
        wx.setStorageSync("invite", opts.query.uid) /* 邀请码记录 */
      }
    }

    let userInfo = wx.getStorageSync("userInfo") || {}
    let authKey = wx.getStorageSync("authKey")
    /* storage中信息缺失,重新登录 */
    if (!(userInfo.mobile && authKey)) {
      await this.wxLogin()
    }
    /* 初始化store */
    this.initStore()
    if (!this.store.$state.userInfo.mobile) {
      /* 新用户注册不用提示签到 */
      this.globalData.quickInteg = false
      wx.reLaunch({ url: "/pages/login/login" })
    } else {
      opts.query.type !== "share" && wx.reLaunch({ url: "/pages/index/index" })
    }
  },
  onShow: function(opts) {
    let lists = ["share", "invite"]
    /* 小程序(在后台运行中时)从分享卡片过来 */
    if (getCurrentPages().length > 0 && this.globalData.scenes.indexOf(opts.scene) >= 0 && lists.indexOf(opts.query.type) >= 0) {
      this.globalData.path = "/" + opts.path /* 卡片页面路径 */
      this.globalData.query = opts.query /* 卡片页面参数 */
      if (!this.store.$state.userInfo.mobile) {
        /* 邀请码记录 */
        if (opts.query.type == "invite") {
          wx.setStorageSync("invite", opts.query.uid)
        }
        wx.reLaunch({ url: "/pages/login/login" })
      } else {
        opts.query.type !== "share" && wx.reLaunch({ url: "/pages/index/index" })
      }
    }
  },
  wxLogin: async function() {
    await wx.pro.login({}).then(res => {
      this.globalData.code = res.code
    })
    await this.user.wxLoginCode({ code: this.globalData.code }).then(msg => {
      if (msg.code === 1) {
        if (msg.data.tempCode) {
          /* 新用户未注册 */
          this.globalData.tempCode = msg.data.tempCode
        } else {
          /* 旧用户 */
          wx.setStorageSync("token", msg.data.token)
          wx.setStorageSync("uid", msg.data.uid)
          wx.setStorageSync("authKey", msg.data.authKey)
          this.setUser(msg.data.userInfo)
        }
      }
    })
  },
  /* 初始化store */
  initStore: function() {
    this.store.setState({
      visitedNum: wx.getStorageSync("visitedNum") || [],
      userInfo: wx.getStorageSync("userInfo") || {},
      authKey: wx.getStorageSync("authKey")
    })
    this.getSets()
  },
  /* 更新store中的userInfo */
  setUser: function(data) {
    this.store.setState({
      userInfo: data
    })
    wx.setStorageSync("userInfo", data)
  },
  /* 用户授权情况  */
  getSets: function() {
    let self = this
    wx.getSetting({
      success: res => {
        if (res.errMsg == "getSetting:ok") {
          let auth = res.authSetting["scope.userInfo"]
          self.store.setState({
            authUserInfo: auth || false,
            baseInfo: !auth && self.store.$state.visitedNum.length > 10
          })
        }
      }
    })
  },
  addVisitedNum: function(id) {
    let arr = this.store.$state.visitedNum
    if (!this.store.$state.authUserInfo && arr.indexOf(id) == -1) {
      arr.push(id)
      this.store.setState({
        visitedNum: arr,
        baseInfo: arr.length > 10
      })
      wx.setStorageSync("visitedNum", arr)
    }
  },
  /* 授权更新用户信息 */
  updateBase(e, page) {
    if (e.detail.errMsg != "getUserInfo:ok") {
      return
    }
    this.getSets()
    let param = {
      userInfo: JSON.stringify(e.detail.userInfo),
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }
    this.user.profile(param).then(msg => {
      if (msg.code == 1) {
        this.setUser(msg.data.userInfo)
        let userInfo = JSON.parse(JSON.stringify(msg.data.userInfo))
        if (userInfo) userInfo.address = userInfo.address ? userInfo.address.split(",")[1] : ""
        page.setData({
          userInfo: userInfo
        })
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback()
        }
      }
    })
  },
  initSignIn() {
    let sign = wx.getStorageSync("signStatus") || {}
    /* 是否已签到 */
    this.globalData.integration = sign.time == new Date().toDateString() && sign.status
    /* 每天只显示一次签到弹窗 */
    if (sign.time == new Date().toDateString() && sign.modal) {
      this.globalData.quickInteg = false
    } else {
      this.globalData.quickInteg = true
      wx.setStorage({
        key: "signStatus",
        data: { time: new Date().toDateString(), status: sign.status || false, modal: true }
      })
    }
  },
  checkVersion: function() {
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        console.log("onCheckForUpdate====", res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log("res.hasUpdate====")
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: "更新提示",
              content: "新版本已经准备好，是否重启应用？",
              success: function(res) {
                console.log("success====", res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
            wx.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
            })
          })
        }
      })
    }
  },
  globalData: {
    /*wx.login 返回值 code */
    code: null,
    /* 新用户临时code */
    tempCode: null,
    /* 签到弹窗 */
    quickInteg: false,
    /* 签到状态 */
    integration: null,
    /* 卡片路径 */
    path: null,
    /* 卡片参数 */
    query: {},
    /* 卡片进入的场景值 */
    scenes: [1007, 1008, 1047, 1048, 1049]
  }
})
