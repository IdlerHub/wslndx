//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    content: ""
  },
  onLoad(options) {
    this.setData({
      content: options.content
    })
  },
  input(e) {
    this.setData({
      content: e.detail.value
    })
  },
  cancel() {
    this.setData({
      content: null
    })
  },
  // 发布评论
  release() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit("commentContent", { data: this.data.content })
    wx.navigateBack({ delta: 1 })
  }
})
