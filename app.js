//base64
import { Base64 } from "utils/base64.js"
/*添加async await*/
import regeneratorRuntime from "wx-promise-pro"
/*添加微信官方接口转化为promise*/
const wxpro = require("wx-promise-pro")
/*埋点统计*/
const ald = require("./utils/ald-stat.js")

//app.js
App({
  API_URL: "https://apielb.jinlingkeji.cn/api/v1/", //正式域名：https://apielb.jinlingkeji.cn   开发域名：https://develop.jinlingkeji.cn/api/v1/
  IMG_URL: "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com/images/pro",
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
  data: {},
  onLaunch: async function(opts) {
    let sign = wx.getStorageSync("signStatus") || {}
    /* 签到状态 */
    this.globalData.integration = sign.time == new Date().toDateString() && sign.status
    /* 每天显示一次签到弹窗 */
    if (sign.time == new Date().toDateString() && sign.modal) {
      this.globalData.quickInteg = false
    } else {
      this.globalData.quickInteg = true
      wx.setStorage({
        key: "signStatus",
        data: { time: new Date().toDateString(), status: sign.status || false, modal: true }
      })
    }

    /* 检查版本更新 */
    this.checkVersion()
    /* 检查用户是否时分享卡片进来 */
    if (opts.scene == 1007 || opts.scene == 1008) {
      /* 卡片页面路径 */
      this.globalData.path = "/" + opts.path
      /* 卡片页面参数 */
      this.globalData.query = opts.query
      /* 邀请码记录 */
      if (opts.query.type == "invite") {
        wx.setStorageSync("invite", opts.query.uid)
      }
    }
    /* 直接进入首页的全部要求授权 */
    let userInfo = wx.getStorageSync("userInfo") || {}
    if (!!userInfo.mobile) {
      this.globalData.userInfo = userInfo
      !(opts.query.type == "share") && wx.reLaunch({ url: "/pages/index/index" })
    } else {
      await this.wxLogin()
      if (!this.globalData.userInfo.mobile) {
        /* 新用户注册不用提示签到 */
        this.globalData.quickInteg = false
        wx.reLaunch({ url: "/pages/login/login" })
      } else {
        !(opts.query.type == "share") && wx.reLaunch({ url: "/pages/index/index" })
      }
    }
  },
  onShow: function(opts) {
    let lists = ["share", "invite"]
    /* 小程序已经启动后从分享卡片过来 */
    if (getCurrentPages().length > 0 && (opts.scene == 1007 || opts.scene == 1008) && lists.indexOf(opts.query.type) >= 0) {
      /* 卡片页面路径 */
      this.globalData.path = "/" + opts.path
      /* 卡片页面参数 */
      this.globalData.query = opts.query
      if (!this.globalData.userInfo.mobile) {
        /* 邀请码记录 */
        if (opts.query.type == "invite") {
          wx.setStorageSync("invite", opts.query.uid)
        }
        wx.reLaunch({ url: "/pages/login/login" })
      } else {
        !(opts.query.type == "share") && wx.reLaunch({ url: "/pages/index/index" })
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
          wx.setStorageSync("userInfo", msg.data.userInfo)
          this.globalData.userInfo = msg.data.userInfo
        }
      }
    })
  },
  addVisitedNum: function(id) {
    let userInfo = wx.getStorageSync("userInfo")
    if (!userInfo.nickname) {
      let arr = wx.getStorageSync("visitedNum") ? wx.getStorageSync("visitedNum") : []
      if (arr.indexOf(id) == -1) {
        arr.push(id)
        wx.setStorageSync("visitedNum", arr)
      }
    }
  },
  updateBase(e, page) {
    if (e.detail.errMsg != "getUserInfo:ok") {
      page.setData({ baseInfo: true })
      return
    }
    let param = {
      userInfo: JSON.stringify(e.detail.userInfo),
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }
    this.user.profile(param).then(msg => {
      if (msg.code == 1) {
        this.globalData.userInfo = msg.data.userInfo
        wx.setStorageSync("userInfo", msg.data.userInfo)
        let userInfo = msg.data.userInfo
        if (userInfo) userInfo.address = userInfo.address ? userInfo.address.split(",")[1] : ""
        page.setData({
          userInfo: userInfo,
          baseInfo: false
        })
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback()
        }
      }
    })
  },
  baseInfo: function(page) {
    let visitedNum = wx.getStorageSync("visitedNum")
    let userInfo = wx.getStorageSync("userInfo")
    if (visitedNum.length > 10 && !userInfo.nickname) {
      page.setData({ baseInfo: true })
    }
  },
  checkVersion: () => {
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
    /* 登录用户信息 */
    userInfo: {},
    /* 签到弹窗 */
    quickInteg: false,
    /* 签到状态 */
    integration: null,
    /*  */
    /* 卡片路径 */
    path: null,
    /* 卡片参数 */
    query: {}
  }
})
