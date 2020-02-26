// pages/voteProduction/voteProduction.js
import {
  wxp
} from "../../utils/service";

Page({
  data: {
    productionName: '', //作品名称
    introduction: '', //作品介绍
    classifyArray: ['书法', '舞蹈', '演讲'], //作品选择分类
    classifyIndex: Number,
    modality: ['图片', '视频'],
    modalityIndex: 0,
    imgList: [],
    poster: ''
  },
  changeName(e) {
    this.setData({
      productionName: e.detail.value
    })
  },
  changeIntroduction(e) {
    this.setData({
      introduction: e.detail.value
    })
  },
  classifyChange(e) { // 修改分类
    console.log("选中改变", e)
    this.setData({
      classifyIndex: e.detail.value
    })
  },
  changeModality(e) { // 图片 || 视频
    this.setData({
      modalityIndex: e.currentTarget.dataset.index
    })
  },
  uploadVideo() { //上传视频
    wxp.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      compressed: true
    }).then(res => {
      console.log(res)
      if (res.duration > 60) {
        console.log('视频长度大于60s')
      } else if (res.size > 200 * 1024 * 1024) {
        console.log('视频大于200M')
      } else {
        this.obsUpload(res.tempFilePath)
      }
    })

  },
  delVideo() { //删除视频
    this.setData({
      poster:''
    })
  },
  uploadImg() { //上传图片
    wxp.chooseImage({
      count: 9 - this.data.imgList.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    }).then(res => {
      console.log(res)
      this.obsUpload(res.tempFilePaths)
    })
  },
  obsUpload(medias) {
    if (this.data.modalityIndex) { //视频 
      this.setData({
        poster: '视频封面'
      })
    } else { //图片
      this.setData({
        imgList: this.data.imgList.concat(medias)
      })
    }
  },
  delImg(e) { //删除图片
    console.log(e)
    let pics = this.data.imgList
    pics.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      imgList: pics
    })
  },
  preview(e){
    let images = this.data.imgList
    wx.previewImage({
      current: images[e.currentTarget.dataset.index] , 
      urls: images 
    })
  },
  submitProduction(e) { //提交作品
    console.log("立即参赛");
    console.log(this.data)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})