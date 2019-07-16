//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    nav: [{ name: "评论", class: ".comment" }, { name: "点赞", class: ".praise" }],
    isRefreshing: false,
    tip: true
    /* rect: wx.getMenuButtonBoundingClientRect() */
  },
  onLoad(options) {
    this.id = options.id
    this.comParam = this.praParam = { blog_id: this.id, page: 1, pageSize: 10 }
    if (options.comment) {
      this.show()
    }
    this.setData({
      detail: [],
      comment: [],
      praise: [],
      vistor: options.type == "share", //游客从分享卡片过来
      currentTab: 0,
      navScrollLeft: 0
    })

    if (this.data.vistor) {
      setTimeout(() => {
        this.setData({
          tip: false
        })
      }, 10000)
    }

    if (this.data.$state.userInfo.mobile) {
      this.getDetail()
      this.getComment()
      this.getPraise()
    }
  },
  setHeight() {
    /*todo:考虑去掉that*/
    let that = this
    let nav = this.data.nav
    let currentTab = this.data.currentTab
    let query = wx.createSelectorQuery().in(this)
    query.select(nav[currentTab].class).boundingClientRect()
    query.exec(res => {
      let height = res[0].height
      that.setData({
        height: height
      })
    })
  },
  switchNav(event) {
    let cur = event.currentTarget.dataset.current
    if (this.data.currentTab !== cur) {
      this.setData({
        currentTab: cur
      })
    }
    this.setHeight()
  },
  switchTab(event) {
    let cur = event.detail.current
    this.setData({
      currentTab: cur
    })
    this.setHeight()
  },
  getDetail() {
    let param = { blog_id: this.id }
    app.circle.detail(param).then(msg => {
      if (msg.code == 1) {
        let detail = msg.data[0]
        detail.lw = app.util.tow(detail.likes)
        detail.cw = app.util.tow(detail.comments)
        let arr = []
        detail.images.forEach(function(i) {
          arr.push(i.image)
        })
        detail.images = arr
        detail.auditing = new Date().getTime() - new Date(detail.createtime * 1000) < 7000
        detail.pause = true
        this.setData({
          detail: detail
        })
      }
    })
  },
  praise() {
    let detail = this.data.detail
    let param = {
      blog_id: detail.id
    }
    if (detail.likestatus == 1) {
      // 取消点赞
      app.circle.delPraise(param).then(msg => {
        if (msg.code == 1) {
          this.getDetail()
          this.praParam.page = 1
          this.getPraise([])
        }
      })
    } else {
      // 点赞
      app.circle.praise(param).then(msg => {
        if (msg.code == 1) {
          detail.praising = true
          this.setData({ detail: detail })
        }
      })
    }
  },
  aniend() {
    this.getDetail()
    this.praParam.page = 1
    this.getPraise([])
  },
  play() {
    let detail = this.data.detail
    let videoContext = wx.createVideoContext(String(detail.id))
    videoContext.play()
    this.setData({
      "detail.pause": false
    })
  },
  ended() {
    this.setData({
      "detail.pause": true
    })
  },
  show() {
    this.setData({
      write: true
    })
  },
  hide() {
    this.setData({
      write: false,
      content: null
    })
  },
  input(e) {
    this.setData({
      content: e.detail.value
    })
  },
  // 发布评论
  release() {
    let param = { blog_id: this.id, content: this.data.content }
    if (this.data.content) this.post(param)
  },
  post(param) {
    this.setData({
      write: false,
      content: null
    })
    wx.showLoading({
      title: "发布中"
    })
    app.circle.comment(param).then(msg => {
      wx.hideLoading()
      if (msg.code == 1) {
        let timer = setTimeout(() => {
          wx.showToast({
            title: "发布成功",
            icon: "none",
            duration: 1500
          })
          this.setData({
            ["detail.comments"]: ++this.data.detail.comments
          })
          this.comParam.page = 1
          this.getComment([])
          clearTimeout(timer)
        }, 500)
      } else {
        wx.showToast({
          title: "发布失败",
          icon: "none",
          duration: 1500
        })
      }
    })
  },
  navigator() {
    this.setData({
      write: false,
      content: null
    })
    wx.navigateTo({
      url: "../comment/comment?id=" + this.data.detail.id
    })
  },
  getComment(list) {
    let comment = list || this.data.comment
    return app.circle.getComment(this.comParam).then(msg => {
      if (msg.code == 1) {
        msg.data.forEach(function(item) {
          comment.push(item)
        })
        this.setData({
          comment: comment
        })
      }
      this.setHeight()
    })
  },
  getPraise(list) {
    let praise = list || this.data.praise
    return app.circle.getPraise(this.praParam).then(msg => {
      if (msg.code == 1) {
        this.setData({
          praise: praise.concat(msg.data || [])
        })
      }
      this.setHeight()
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    let currentTab = this.data.currentTab
    this.setData({
      isRefreshing: true
    })
    switch (currentTab) {
      case 0:
        this.comParam.page = 1
        this.getComment([]).then(() => {
          wx.stopPullDownRefresh()
        })
        break
      case 1:
        this.praParam.page = 1
        this.getPraise([]).then(() => {
          wx.stopPullDownRefresh()
        })
        break
    }
    let timer = setTimeout(() => {
      this.setData({
        isRefreshing: false
      })
      clearTimeout(timer)
    }, 1000)
  },
  //上拉加载
  onReachBottom() {
    let currentTab = this.data.currentTab
    switch (currentTab) {
      case 0:
        this.comParam.page++
        this.getComment()
        break
      case 1:
        this.praParam.page++
        this.getPraise()
        break
    }
  },
  //图片预览
  previewImage(e) {
    let urls = e.currentTarget.dataset.urls
    let current = e.currentTarget.dataset.current
    wx.previewImage({
      current: current,
      urls: urls // 需要预览的图片http链接列表
    })
  },
  onShareAppMessage: function(ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button")
      let bkid = ops.target.dataset.id
      app.circle.addForward({ blog_id: bkid }).then(() => {
        this.getDetail()
      })
      let article = this.data.detail
      return {
        title: article.content,
        imageUrl: article.image || article.images[0] || "../../images/sharemessage.jpg",
        path: "/pages/pDetail/pDetail?id=" + bkid + "&type=share"
      }
    }
  },
  //删除评论
  delComment: function(e) {
    let param = { blog_id: e.currentTarget.dataset.item.blog_id, id: e.currentTarget.dataset.item.id }
    app.circle.delComment(param).then(msg => {
      wx.hideLoading()
      if (msg.code == 1) {
        let timer = setTimeout(() => {
          wx.showToast({
            title: "删除成功",
            icon: "none",
            duration: 1500
          })
          this.setData({
            ["detail.comments"]: --this.data.detail.comments
          })
          this.comParam.page = 1
          this.getComment([])
          clearTimeout(timer)
        }, 500)
      } else {
        wx.showToast({
          title: "删除失败，请稍后重试",
          icon: "none",
          duration: 1500
        })
      }
    })
  },
  tohome: function() {
    wx.reLaunch({ url: "/pages/index/index" })
  },
  toUser(e) {
    if (this.data.$state.userInfo.id == e.currentTarget.dataset.uid) {
      wx.navigateTo({
        url: "/pages/user/user"
      })
    }
  }
})
