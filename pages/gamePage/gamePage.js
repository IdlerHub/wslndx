// pages/gamePage/gamePage.js
Page({
  data: {
    url: ''
  },
  onLoad: function (ops) {
    wx.getStorage({
      key: 'openId',
      success: res => {
        this.setData({
          url: `https://lnddz.293k.com/?openid=${res.data}`
        })
      }
    })
    
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onShareAppMessage: function () {

  }
})