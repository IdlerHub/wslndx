// pages/vote/vote.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyList: ['全部','书法绘画','摄影','演讲','舞蹈','武术','语文','英语','数学'],
    selectedIndex: 1,
    productionList: [
      {
        "id": 13,
        "name": "测试作品9",
        "type": 2,
        "url": [
          "https://jxglcdnbj4.jinlingkeji.cn/uploads/images/201911/20/1b90fa4fd118477f89fddfe02aaab4a7.jpg"
        ],
        "prise_numbers": 999
      },
      {
        "id": 13,
        "name": "测试作品10",
        "type": 2,
        "url": [
          "https://jxglcdnbj4.jinlingkeji.cn/uploads/images/201911/20/1b90fa4fd118477f89fddfe02aaab4a7.jpg"
        ],
        "prise_numbers": 0
      },
      {
        "id": 13,
        "name": "测试作品9",
        "type": 2,
        "url": [
          "https://jxglcdnbj4.jinlingkeji.cn/uploads/images/201911/20/1b90fa4fd118477f89fddfe02aaab4a7.jpg"
        ],
        "prise_numbers": 999
      },
    ]
  },
  changeclassify(e){
    this.setData({
      selectedIndex: e.currentTarget.dataset.index
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