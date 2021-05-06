// pages/agreement/agreement.js
Page({
  pageName: '服务协议（登录页服务协议）',
  unshowLogin: 1,
  toLogin() {
    let page = getCurrentPages()[getCurrentPages().length - 2]
    page.selectComponent('#loginBox').setData({
      check: true
    })
    wx.navigateBack({
      delta: 0,
    })
  }
})