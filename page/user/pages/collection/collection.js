const app = getApp()
//Page Object
Page({
  data: {
    collect: [],
    isRefreshing: false,
    showSheet: false,
    currentTab: 0,
    circleList: []
  },
  pageName: '收藏课程',
  //options(Object)
  onLoad: function (options) {
    this.collectParam = { page: 1, pageSize: 10 }
    this.liveParam = { page: 1, pageSize: 10 }
    this.circleparam = { page: 1, pageSize: 10 }
    this.getCollect([])
    this.getCircle([])
  },
  onReady: function () { },
  onShow: function () {
    let list = this.data.circleList
    list.forEach(item => {
      if (item.id == app.globalData.detail.id) {
        if (app.globalData.detail.likestatus > 0) {
          item.likes = app.globalData.detail.likes
          item.likestatus = app.globalData.detail.likestatus
        } else {
          item.likes = app.globalData.detail.likes
          item.likestatus = app.globalData.detail.likestatus
        }
      }
      this.setData({
        circleList: list
      })
    })
  },
  onHide: function () { },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
    this.setData({
      isRefreshing: true
    })
    this.collectParam.page = 1
    this.getCollect([]).then(() => {
      this.setData({
        isRefreshing: false
      })
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom: function () {
    if (this.currentTab == 0) {
      this.collectParam.page++
      this.getCollect()
    } else {
      this.circleparam.page++
      this.getCircle()
    }
  },
  scrollEnd() {
    if (this.data.currentTab == 0) {
      this.collectParam.page++
      this.getCollect()
    } else {
      this.circleparam.page++
      this.getCircle()
    }
  },
  getCollect(list) {
    let collect = list || this.data.collect
    return app.user.collect(this.collectParam).then(msg => {
      this.setData({
        collect: collect.concat(msg.data)
      })
    })
  },
  getCircle(list) {
    let temp = list || this.data.circleList
    return app.user.collectBlog(this.circleparam).then(msg => {
      msg.data.length == 0 ? this.setData({
        showNomore: true
      }) : this.setData({
        showNomore: false
      })
      if (msg.data) {
        let arr = [];
        for (let i in msg.data) {
          arr.push(msg.data[i])
        }
        arr.forEach(function (item) {
          item.fw = app.util.tow(item.forward)
          item.cw = app.util.tow(item.comments)
          item.lw = app.util.tow(item.likes)
          item.image_compress = item.images.map(i => {
            return i.image_compress
          })
          item.images = item.images.map(i => {
            return i.image
          })
          item.auditing = item.check_status
        })
        temp.push(...arr)
        this.setData({
          circleList: temp
        })
      }
    })
  },
  praise(e) {
    let i = e.currentTarget.dataset.index
    let list = this.data.circleList
    let param = {
      blog_id: list[i].id
    }
    if (list[i].likestatus == 1) {
      // 取消点赞
      app.circle.delPraise(param).then(msg => {
        list[i].likestatus = 0
        list[i].likes--
        this.setData({
          circleList: list
        })
      }).catch(msg => {
        if (msg.code == -2) {
          wx.showToast({
            title: "帖子已删除",
            icon: "none",
            duration: 1500
          })
        }
      })
    } else {
      // 点赞
      app.circle.praise(param).then(msg => {
        list[i].likestatus = 1
        list[i].likes++
        list[i].praising = true
        // app.socket.send(list[i].uid)
        app.socket.send({
          type: 'Bokemessage',
          data: { uid: list[i].uid }
        })
        this.setData({
          circleList: list
        })
      }).catch(msg => {
        if (msg.code == -2) {
          wx.showToast({
            title: "帖子已删除",
            icon: "none",
            duration: 1500
          })
        }
      })
    }
  },
  aniend(e) {
    var i = e.currentTarget.dataset.index
    var list = this.data.circleList
    list[i].praising = false
    this.setData({
      circleList: list
    })
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
  unShare() {
    wx.showToast({
      title: "非常抱歉，不能分享这个内容！",
      icon: "none",
      duration: 1500
    })
  },
  //用户黑名单判断
  handleRelse(status) {
    if (this.data.$state.userInfo.status !== 'normal') {
      wx.showModal({
        content: '由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理'
      })
    } else {
      status.currentTarget.dataset.type == 'reply' ? wx.navigateTo({
        url: `/page/post/pages/pages/pDetail/pDetail?id= ${status.currentTarget.dataset.id}&comment`,
      }) : wx.navigateTo({
        url: '/page/post/pages/release/release',
      })
    }
  },
  toUser(e) {
    if (this.data.$state.userInfo.id == e.currentTarget.dataset.uid) {
      wx.switchTab({
        url: "/pages/user/user"
      })
    } else {
      wx.navigateTo({
        url: `/page/post/pages/personPage/personPage?uid=${e.currentTarget.dataset.item.uid}&nickname=${e.currentTarget.dataset.item.nickname}&university_name=${e.currentTarget.dataset.item.university_name}&avatar=${e.currentTarget.dataset.item.avatar}&addressCity=${e.currentTarget.dataset.item.province}&follow=${e.currentTarget.dataset.item.is_follow}`
      });
    }
  },
  onShareAppMessage: function (ops, b) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      let i = ops.target.dataset.index
      let article = this.data.circleList[i]
      let bkid = article.id
      app.circle.addForward({ blog_id: bkid }).then(res => {
        let list = this.data.circleList
        list[i].forward += 1
        this.setData({
          circleList: list
        })
      })
      return {
        title: app.util.delHtmlTag(article.content),
        imageUrl: article.image || article.images[0] || "../../images/sharemessage.jpg",
        path: "/page/post/pages/pDetail/pDetail?id=" + bkid + "&type=share&uid=" + this.data.$state.userInfo.id
      }
    }
  },
  navigate(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "/page/post/pages/pDetail/pDetail?id=" + id
    })
  },
  //取消收藏
  cancelCollection() {
    let param = { blog_id: this.data.blog_id }
    app.circle.collectCancel(param).then(res => {
      let list = this.data.circleList
      list.splice(this.data.blog_index, 1)
      this.setData({
        circleList: list
      })
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 800
      })
    }).catch(err => {
      wx.showToast({
        title: err.msg,
        image: '/images/warn.png',
        duration: 800
      })
    })
    this.setData({
      showSheet: false
    })
  },
  collect(e) {
    let blog_id = e.currentTarget.dataset.id
    let blog_index = e.currentTarget.dataset.index
    this.setData({
      blog_id,
      blog_index
    })
    this.setData({
      showSheet: true,
      showNomore: false
    })
  },
  closeSheet() {
    this.setData({
      showSheet: false
    })
  },
  switchTab(event) {
    let cur = event.detail.current
    this.setData({
      currentTab: cur
    })
  },
  tap(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      currentTab: type
    })
  },
  /*长按复制内容 */
  copythat(e) {
    app.copythat(e.target.dataset.content)
  }
})
