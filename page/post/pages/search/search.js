// page/post/pages/search/search.js
Page({
  data: {
    text: ''
  },
  onLoad: function (options) {

  },
  onReady: function () {

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
  txtchange(e) {
    this.setData({
      text: e.detail.value
    })
  },
  cleartxt() {
    this.setData({
      text: ""
    });
  },
})