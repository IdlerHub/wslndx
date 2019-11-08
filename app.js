/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-13 14:06:00
 */
/*添加微信官方接口转化为promise*/
const wxpro = require("wx-promise-pro")
/*埋点统计*/
const ald = require("./utils/ald-stat.js")
/* 全局状态管理 */
import store from "./store"
/* sse */
const socket = require("data/socket.js")
/* 接入bug平台 */
if (store.process == "production") {
  var fundebug = require("fundebug-wxjs")
  fundebug.init({
    apikey: "b3b256c65b30a1b0eb26f8d9c2cd7855803498f0c667df934be2c72048af93d9",
    releaseStage: "production",
    filters: [
      {
        req: {
          url: /log\.aldwx\.com/,
          method: /^GET$/
        }
      },
      {
        error: /getHistory/
      }
    ]
  })
}

//app.js
App({
  API_URL: store.API_URL,
  //工具库
  util: require("utils/util.js"),
  md5: require("utils/md5.js"),
  //http请求接口
  classroom: require("data/Classroom.js"),
  user: require("data/User.js"),
  video: require("data/Video.js"),
  circle: require("data/Circle.js"),
  socket,
  store,
  onLaunch: async function(opts) {
    console.log(opts)
    let optsStr = decodeURIComponent(opts.query.scene).split('&')
    let opstObj = {}
    optsStr.forEach((item, index) => {
      opstObj[item.split('=')[0]]=item.split('=')[1]
    })
    console.log(opstObj)
    this.checkVersion()
    /* 检查用户从分享卡片启动 */
    if (this.globalData.scenes.indexOf(opts.scene) >= 0) {
      this.globalData.path = "/" + opts.path /* 卡片页面路径 */
      this.globalData.query = opts.query /* 卡片页面参数 */
      if (opts.query.type == "invite" || opts.query.type == "share" || opstObj.type == "invite") {
        console.log(opstObj)
        if (opts.query.uid) {
          wx.setStorageSync("invite", opts.query.uid) /* 邀请码记录 */
        } else {
          wx.setStorageSync("invite", opstObj.uid) /* 邀请码记录 */
        }
        
      }
    }
    let userInfo = wx.getStorageSync("userInfo") || {}
    let mpVersion = wx.getStorageSync("mpVersion")
    /* storage中信息缺失,重新登录 */
    if (!userInfo.mobile || mpVersion != this.store.mpVersion) {
      await this.wxLogin()
      wx.setStorageSync("mpVersion", this.store.mpVersion)
    }
    this.initStore()

    /* 建立socket链接 */
    
    if (this.store.$state.userInfo.id) {
      setTimeout(()=> {
        socket.init(userInfo.id)
        socket.listen(this.handleMessage)
      },2000)
    }
    let systemInfo = wx.getSystemInfoSync()
    let wxtype = systemInfo.version.replace(".", '').replace(".", '')

    if (wxtype < 703) {
      wx.reLaunch({ url: "/pages/upwxpage/upwxpage" })
    } else if (!this.store.$state.userInfo.mobile) {
      wx.redirectTo({ url: "/pages/sign/sign" })
    } else if (opts.query.type !== "share") {
      wx.reLaunch({ url: "/pages/index/index" })
    }
  },
  onShow: function(opts) {
    let lists = ["share", "invite"]
    /* 小程序(在后台运行中时)从分享卡片切到前台 */
    if (this.globalData.backstage) {
      this.globalData.backstage = false
      this.socket.backstage()
      if (this.globalData.scenes.indexOf(opts.scene) >= 0 && lists.indexOf(opts.query.type) >= 0) {
        this.globalData.path = "/" + opts.path /* 卡片页面路径 */
        this.globalData.query = opts.query /* 卡片页面参数 */
        if (opts.query.type == "invite" || opts.query.type == "share") {
          wx.setStorageSync("invite", opts.query.uid) /* 邀请码存储 */
        }
      }

      if (!this.store.$state.userInfo.mobile) {
        wx.redirectTo({ url: "/pages/sign/sign" })
      } else if (opts.path == "pages/loading/loading") {
        wx.reLaunch({ url: "/pages/index/index" })
      }
    }
  },
  onHide() {
    this.globalData.backstage = true
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
          console.log(msg.data.userInfo)
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      }
    })
  },
  /* 初始化store */
  initStore: function() {
    let sign = wx.getStorageSync("signStatus") || {}
    if (sign.time !== new Date().toDateString()) {
      sign = { status: false, count: 0 }
    }
    this.store.setState({
      visitedNum: wx.getStorageSync("visitedNum") || [],
      userInfo: wx.getStorageSync("userInfo") || {},
      authKey: wx.getStorageSync("authKey") || "",
      signStatus: sign
    })

    this.getSets()
  },
  /* 更新store中的userInfo */
  setUser: function(data) {
    let areaArray = data.university.split(",")
    if ((!data.address || !data.school) && areaArray.length == 3) {
      data.address = areaArray.slice(0, 2)
      data.addressCity = areaArray[1]
      data.school = areaArray[2]
    }
    this.store.setState({
      userInfo: data
    })
    wx.setStorageSync("userInfo", data)
    if (data.id) {
      socket.close()
      socket.init(data.id)
      socket.listen(this.handleMessage)
    }
  },
  /* 更新AuthKey */
  setAuthKey: function(data) {
    this.store.setState({
      authKey: data
    })
    wx.setStorageSync("authKey", data)
  },
  /* 更新转发分享 */
  setShare: function (data) {
    this.store.setState({
      shareImgurl: data.data.img_url,
      shareTitle: data.data.title
    })
  },
  /* 更新store中的用户授权  */
  getSets: function() {
    let self = this
    wx.getSetting({
      success: res => {
        console.log(res)
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
  /* 更新store中的用户免费查看的视频数目 */
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
  /* 授权更新数据库及store中的用户信息 */
  updateBase(e) {
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
      }
    })
  },
  tabBar(path) {
    this.store.setState({
      tabPath: path
    })
  },
  playVedio(type) {
    type == 'wifi' ? '' :
    this.store.setState({
      flow: true
    })
  },
  /* 更新签到信息 */
  setSignIn(data, bl) {
    /* 每天只显示一次签到弹窗 */
    this.store.setState({
      signStatus: data
    })

    !!bl && wx.setStorage({ key: "signStatus", data: { time: new Date().toDateString(), status: data.status, count: data.count } })
  },
  /* 版本检测 */
  checkVersion: function() {
    let systemInfo = wx.getSystemInfoSync()
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
  handleMessage(res) {
    let { num = 0, avatar } = JSON.parse(res.data)
    this.store.setState({
      unRead: num,
      surPass: num > 99,
      lastMan: avatar
    })
  },
  onPageNotFound() {
    wx.reLaunch({
      url: "/pages/index/index"
    })
  },
  // 获取新手指引
  getGuide() {
    return this.user.guideRecord().then(res =>{
      if(res.code == 1) {
        let newGuide = res.data
        this.store.setState({
          newGuide
        })
      }
    })
  },
  globalData: {
    /*wx.login 返回值 code */
    code: null,
    /* 新用户临时code */
    tempCode: null,
    /* 卡片路径 */
    path: null,
    /* 卡片参数 */
    query: {},
    /* 卡片进入的场景值 */
    scenes: [1007, 1008, 1047, 1048, 1049],
    /* 后台模式*/
    backstage: false,
    rlSuc: false,
    path: 'index',
    currentTab: 0,
    detail:{
      id:0,
      likestatus:0
    }
  }
})
