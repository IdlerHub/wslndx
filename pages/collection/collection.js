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
  //options(Object)
  onLoad: function (options) {
    this.collectParam = { page: 1, pageSize: 10 }
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
    // app.aldstat.sendEvent("退出", { name: "收藏课程" })
    wx.uma.trackEvent('move', { 'pageName': '我的收藏' });
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
      if (msg.code == 1) {
        this.setData({
          collect: collect.concat(msg.data)
        })
      }
    })
  },
  getCircle(list) {
    let temp = list || this.data.circleList
    return app.user.collectBlog(this.circleparam).then(msg => {
      if (msg.code == 1) {
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
        if (msg.code == 1) {
          list[i].likestatus = 0
          list[i].likes--
          this.setData({
            circleList: list
          })
        } else if (msg.code == -2) {
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
        if (msg.code == 1) {
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
        } else if (msg.code == -2) {
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
        url: `/pages/pDetail/pDetail?id= ${status.currentTarget.dataset.id}&comment`,
      }) : wx.navigateTo({
        url: '/pages/release/release',
      })
    }
  },
  toUser(e) {
    if (this.data.$state.userInfo.id == e.currentTarget.dataset.uid) {
      wx.switchTab({
        url: "/pages/user/user"
      })
    }
  },
  toMessage() {
    wx.navigateTo({
      url: "/pages/message/message"
    })
  },
  onShareAppMessage: function (ops, b) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button")
      let i = ops.target.dataset.index
      let article = this.data.circleList[i]
      let bkid = article.id
      app.circle.addForward({ blog_id: bkid }).then(res => {
        if (res.code == 1) {
          let list = this.data.circleList
          list[i].forward += 1
          this.setData({
            circleList: list
          })
        }
      })
      return {
        title: article.content,
        imageUrl: article.image || article.images[0] || "../../images/sharemessage.jpg",
        path: "/pages/pDetail/pDetail?id=" + bkid + "&type=share&uid=" + this.data.$state.userInfo.id
      }
    }
  },
  navigate(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "../pDetail/pDetail?id=" + id
    })
  },
  //取消收藏
  cancelCollection() {
    let param = { blog_id: this.data.blog_id }
    app.circle.collectCancel(param).then(res => {
      if (res.code == 1) {
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
      } else {
        wx.showToast({
          title: res.msg,
          image: '/images/warn.png',
          duration: 800
        })
      }
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
