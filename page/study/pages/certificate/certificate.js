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
  },
  onShow: function () {
    this.getList()
  },
  onReachBottom: function () {

  },
  getList() {
    app.study.certificateList().then(res => {
      let certificateImg =  wx.getStorageSync('certificateImg') 
      if(certificateImg) {
        res.data.certificatesList.forEach( item => {
          item.certificates.forEach((e, i) => {
            certificateImg[e.id] ? e['qrImg'] = certificateImg[e.id] : null
          })
        })
      }
      res.data.certificatesList.sort((a, b) => {
        return  a.month < b.month ? 1 : -1;
      })
      this.setData({
        certificatesList: res.data.certificatesList,
        totle: res.data.count
      })
    })
  }
})