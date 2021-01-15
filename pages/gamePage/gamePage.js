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
    wx.uma.trackEvent('index_btnClick', { btnName: '斗地主' });
  },
  onReady: function () {

  },
  onShow: function () {

  }
})