// pages/agreement/agreement.js
Page({
  pageName: '服务协议（登录页服务协议）',
  toLogin() {
    wx.redirectTo({
      url: '/pages/login/login?check=1',
    })
  }
})