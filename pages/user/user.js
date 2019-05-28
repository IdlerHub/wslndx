//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    isRefreshing: false
  },
  onLoad() {},
  onShow() {
    if (this.data.$state.userInfo.nickname) {
      /*updateBase请求先返回*/
      this.init()
    } else {
      /*页面先加载，login请求后返回*/
      app.userInfoReadyCallback = () => {
        this.init()
      }
    }
  },
  init() {
    var userInfo = JSON.parse(JSON.stringify(this.data.$state.userInfo))
    if (userInfo) userInfo.address = userInfo.address ? userInfo.address.split(",")[1] : ""
    this.setData({
      userInfo: userInfo
    })
  },
  getUserInfo(e) {
    if (e.detail.errMsg != "getUserInfo:ok") return
    let param = {
      userInfo: JSON.stringify(e.detail.userInfo)
    }
    app.user.profile(param).then(msg => {
      if (msg.code == 1) {
        app.setUser(msg.data.userInfo)
        let userInfo = JSON.parse(JSON.stringify(msg.data.userInfo))
        if (userInfo) userInfo.address = userInfo.address ? userInfo.address.split(",")[1] : ""
        this.setData({
          userInfo: userInfo
        })
      }
    })
  },
  onPullDownRefresh: function() {
    this.setData({
      isRefreshing: true
    })

    setTimeout(() => {
      this.setData({
        isRefreshing: false
      })
      wx.stopPullDownRefresh()
    }, 1000)
  },
  handleContact(e) {},
  //用于数据统计
  onUnload() {
    app.aldstat.sendEvent("退出", { name: "个人中心页" })
  }
})
