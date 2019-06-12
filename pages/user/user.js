//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    isRefreshing: false
  },
  onLoad() {},
  onShow() {},
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
