// page/study/pages/certificate/certificate.js
Page({
  data: {
    top: 0,
    certificateList: []
  },
  onLoad: function (options) {
    wx.getSystemInfoSync().statusBarHeight < 30 ? '' : this.setData({
      top: 44
    })
  },
  onShow: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})