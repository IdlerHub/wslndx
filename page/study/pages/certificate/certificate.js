// page/study/pages/certificate/certificate.js
const app = getApp()
Page({
  data: {
    top: 0,
    totle: 0,
    certificatesList: []
  },
  onLoad: function (options) {
    wx.getSystemInfoSync().statusBarHeight < 30 ? '' : this.setData({
      top: 44
    })
    this.getList()
  },
  onShow: function () {

  },
  onReachBottom: function () {

  },
  getList() {
    app.study.certificateList().then(res => {
      this.setData({
        certificatesList: res.data.certificatesList,
        totle: res.data.count
      })
    })
  }
})