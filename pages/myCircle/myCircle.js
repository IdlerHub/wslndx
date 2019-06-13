const app = getApp()
//Page Object
Page({
  data: {
    circle: [],
    isRefreshing: false
  },
  //options(Object)
  onLoad: function(options) {
    this.circleParam = { page: 1, pageSize: 10 }
    this.getCircle([])
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {
    app.aldstat.sendEvent("退出", { name: "我的圈子" })
  },
  onPullDownRefresh: function() {
    this.setData({
      isRefreshing: true
    })
    this.circleParam.page = 1
    this.getCircle([]).then(() => {
      wx.stopPullDownRefresh()
      this.setData({
        isRefreshing: false
      })
    })
  },
  onReachBottom: function() {
    this.circleParam.page++
    this.getCircle()
  },
  getCircle(list) {
    let circle = list || this.data.circle
    this.circleParam.us_id = 0
    return app.circle.news(this.circleParam).then(msg => {
      if (msg.code == 1) {
        if (msg.data) {
          msg.data.forEach(function(item) {
            item.images = item.images.map(i => {
              return i.image
            })
            item.auditing = new Date().getTime() - new Date(item.createtime * 1000) < 7000
            item.pause = true
            circle.push(item)
          })
        }
        this.setData({
          circle: circle
        })
      }
    })
  },
  //图片预览
  previewImage(e) {
    let that = this
    let urls = e.currentTarget.dataset.urls
    let current = e.currentTarget.dataset.current
    this.setData({
      preview: true
    })
    wx.previewImage({
      current: current,
      urls: urls, // 需要预览的图片http链接列表
      complete: () => {
        that.setData({
          preview: false
        })
      }
    })
  },
  navigate(e) {
    let id = e.currentTarget.dataset.id
    if (!this.data.preview) {
      wx.navigateTo({
        url: "../pDetail/pDetail?id=" + id
      })
    }
  },
  del(e) {
    let i = e.currentTarget.dataset.index
    let circle = this.data.circle
    let param = {
      blog_id: circle[i].id
    }
    wx.showModal({
      title: "",
      content: "是否删除帖子",
      success: res => {
        if (res.confirm) {
          app.circle.delPost(param).then(msg => {
            if (msg.code == 1) {
              wx.startPullDownRefresh()
            }
          })
        } else {
          return
        }
      }
    })
  },
  // 写帖成功动效
  rlSuc() {
    this.setData({
      rlAni: true
    })
    let timer = setTimeout(() => {
      this.setData({
        rlAni: false
      })
      clearTimeout(timer)
    }, 2000)
    this.circleParam.page = 1
    this.getCircle([])
  }
})
