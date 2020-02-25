// pages/voteProduction/voteProduction.js
Page({
  data: {
    productionName: '', //作品名称
    introduction: '',   //作品介绍
    classifyArray: ['书法','舞蹈','演讲'],  //作品选择分类
    classifyIndex: Number,
    modality: ['图片','视频'],
    modalityIndex: 0,
    imgList: [1,2,3,4,5,6],
    video: '',
    videoFlag: false,
  },
  changeName(e){
    this.setData({
      productionName: e.detail.value
    })
  },
  changeIntroduction(e){
    this.setData({
      introduction: e.detail.value
    })
  },
  classifyChange(e){  // 修改分类
    console.log("选中改变", e)
    this.setData({
      classifyIndex: e.detail.value
    })
  },
  changeModality(e){ // 图片 || 视频
    this.setData({
      modalityIndex: e.currentTarget.dataset.index
    })
  },
  uploadVideo() {  //上传视频
    this.setData({
      videoFlag: true
    })
  },
  delVideo(){ //删除视频
    this.setData({
      videoFlag: false
    })
  },
  uploadImg() {  //上传图片

  },
  delImg(e){  //删除图片

  },
  submitProduction(e){  //提交作品
    console.log("立即参赛");
    console.log(this.data)
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