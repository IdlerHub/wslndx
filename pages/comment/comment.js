//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    IMG_URL: app.IMG_URL
  },
  onLoad(options) {
    this.id = options["id"]
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
    let param = { blog_id: this.id, content: this.data.content }
    let pages = getCurrentPages()
    let prePage = pages[pages.length - 2]
    if (pages.length > 1) {
      wx.navigateBack({
        delta: 1,
        success: function() {
          prePage.post(param)
        }
      })
    }
  }
})
