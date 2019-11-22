// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    voiceImg: 'http://118.89.201.75/images/voicebtn.png',
    voiceActon: false,
    voiceheight:''
  },

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
  backhome() {
    wx.navigateBack()
  },
  touchstart() {
    this.setData({
      voiceImg: 'http://118.89.201.75/images/voicebtnr.png',
      voiceActon: true,
    })
  },
  touchend() {
    this.setData({
      voiceImg: 'http://118.89.201.75/images/voicebtn.png',
      voiceActon: false
    })
  },
  keychange(e) {
    console.log(e.detail.height)
    let systems =  wx.getSystemInfoSync()
    e.detail.height == 0 ? '' : this.setData({
      voiceheight: e.detail.height + (systems.screenHeight * 0.1)
    })
  },
  bindblur() {

  },
  touchmove(){
    console.log(1212131431)
    this.setData({
      focus: true
    })
  }
})