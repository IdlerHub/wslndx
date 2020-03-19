// pages/rankingList/rankingList.js
const app = getApp()
Page({
  data: {
    mode: 0,
    time: 0,
    rankType: 1
  },
  onLoad: function (options) {
    let time = new Date()
    time =  app.util.formatTime(time).slice(0,10)
    this.setData({
      time
    })
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {
  },
  check(e) {
    this.setData({
      mode: e.currentTarget.dataset.type
    })
  },
  checkTop(e) {
    this.setData({
      rankType: e.currentTarget.dataset.type
    })
  }
})