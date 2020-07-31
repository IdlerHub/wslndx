// pages/upwxpage/upwxpage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  pageName: '提示更新微信版本',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.reLaunch({ url: "/pages/upwxpage/upwxpage" })    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  upwx() {
    wx.setClipboardData({
      data: 'https://mobile.baidu.com/item?docid=26523238&f0=search_searchContent%400_appBaseNormal%400',
      success: function (res) {
        wx.showToast({
          title: '已成功复制下载新版微信链接，请移步到浏览器粘贴链接下载更新！',
          icon: 'none',
          duration: 4000
        });
      },
    })
  }
})