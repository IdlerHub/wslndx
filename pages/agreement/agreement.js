// pages/agreement/agreement.js
Page({
  toLogin() {
    wx.redirectTo({
      url: '/pages/login/login?check=1',
    })
  }
})