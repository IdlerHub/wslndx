// pages/myProduction/myProduction.js
Page({
  data: {
    state: ['已通过','待审核','未通过'],
    stateIndex: 0,
    stateNum: [1,2,3],
    productionList: [
      {
        "id": 1,
        "name": "风景风景风景风景风景风景风景风景",
        "prise_numbers": 2,
        "createtime": "2020-02-24 14:05:51"
      },
      {
        "id": 2,
        "name": "名胜",
        "prise_numbers": 3,
        "createtime": "2020-02-24 14:05:51"
      }
    ],    //作品列表

  },
  changeState(e){
    console.log(e)
    this.setData({
      stateIndex: e.currentTarget.dataset.index
    })
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

  }
})