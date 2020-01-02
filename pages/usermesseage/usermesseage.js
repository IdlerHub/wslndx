// pages/usermesseage/usermesseage.js
const app = getApp()
Page({
  data: {
    newsList:[]
  },
  onLoad: function (options) {
  },
  onShow: function () {
    this.getMessage()
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  tomessage(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/messagePage/messagePage?id=' + id,
    })
  },
  getMessage() {
    app.user.getMessage().then(res => {
      if(res.code == 1) {
        this.setData({
          newsList: res.data
        })
      }
    })
  }
})