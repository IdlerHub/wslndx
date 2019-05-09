// pages/login/login.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse("button.open-type.getPhoneNumber")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    setTimeout(wx.hideLoading, 500)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  getPhoneNumber: function(e) {
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      return
    }
    let param = {
      mobileEncryptedData: e.detail.encryptedData,
      mobileiv: e.detail.iv,
      tempCode: app.globalData.tempCode,
      invite_uid: wx.getStorageSync("invite") /* 邀请码 */
    }
    app.user.register(param).then(msg => {
      if (msg.code === 1) {
        wx.setStorageSync("token", msg.data.token)
        wx.setStorageSync("uid", msg.data.uid)
        wx.setStorageSync("userInfo", msg.data.userInfo)
        app.globalData.userInfo = msg.data.userInfo
        if (app.globalData.query.type == "share") {
          let params = []
          for (let attr in app.globalData.query) {
            params.push(attr + "=" + app.globalData.query[attr])
          }
          wx.reLaunch({ url: app.globalData.path + "?" + params.join("&") })
        } else {
          /*返回首页*/
          wx.reLaunch({ url: "/pages/index/index" })
        }
      }
    })
  }
})
