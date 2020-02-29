//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    list: [],
    circle: null,
    isRefreshing: false,
    showT: false,
    showSheet: false
  },
  pageName: '圈内帖子列表',
  onLoad(options) {
    this.id = options.id
    this.param = { fs_id: this.id, page: 1, pageSize: 10 }
    this.getList([])
    this.getCircleInfo().then(() => {
      wx.setNavigationBarTitle({
        title: this.data.circle.title
      })
      // app.aldstat.sendEvent("学友圈点击",{
      //   name: this.data.circle.title
      // })
      wx.uma.trackEvent('circleClick', { 'circleName': this.data.circle.title });
    })
    getCurrentPages().forEach(item => {
      item.route == 'pages/post/post' ? this.postPages = item : ''
      item.route == 'pages/personPage/personPage' ? this.personPage = item : ''
    })
  },
  onUnload() { },
  onShow() {
    let list = this.data.list
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
        list
      })
    })
  },
  getList: function (list) {
    let temp = list || this.data.list
    return app.circle.news(this.param).then(msg => {
      if (msg.code === 1 && msg.data) {
        msg.data.forEach(function (item) {
          item.lw = app.util.tow(item.likes)
          item.cw = app.util.tow(item.comments)
          item.image_compress = item.images.map(i => {
            return i.image_compress
          })
          item.images = item.images.map(i => {
            return i.image
          })
          item.auditing = new Date().getTime() - new Date(item.createtime * 1000) < 7000
        })
        this.setData({
          list: temp.concat(msg.data)
        })
      }
    })
  },
  getCircleInfo() {
    return app.circle.fsinfo(this.param).then(msg => {
      if (msg.code === 1) {
        this.setData({
          circle: msg.data
        })
      }
    })
  },
  praise(e) {
    let i = e.currentTarget.dataset.index
    let temp = this.data.list
    let param = {
      blog_id: temp[i].id
    }
    if (temp[i].likestatus) {
      // 取消点赞
      app.circle.delPraise(param).then(msg => {
        if (msg.code === 1) {
          temp[i].likestatus = 0
          temp[i].likes--
          this.setData({
            list: temp
          })
        }
      })
    } else {
      // 点赞
      app.circle.praise(param).then(msg => {
        if (msg.code === 1) {
          temp[i].likestatus = 1
          temp[i].likes += 1
          temp[i].praising = true
          this.setData({
            list: temp
          })
        }
      })
    }
  },
  aniend(e) {
    var i = e.currentTarget.dataset.index
    var list = this.data.list
    list[i].praising = false
    this.setData({
      list: list
    })
  },
  join() {
    let circle = this.data.circle
    let param = { fs_id: this.id }
    return app.circle.addOne(param).then(msg => {
      if (msg.code === 1) {
        wx.showToast({
          title: "您已成功加入\r\n【" + circle.title + "】学友圈",
          icon: "none",
          duration: 1500
        })
        circle.joined = 1
        circle.members += 1
        this.setData({
          circle: circle
        })
      }
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
  navigate(e) {
    wx.navigateTo({
      url: "../pDetail/pDetail?id=" + e.currentTarget.dataset.id
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    this.param.page = 1
    this.setData({
      isRefreshing: true
    })
    this.getList([]).then(() => {
      wx.stopPullDownRefresh()
      let timer = setTimeout(() => {
        wx.hideLoading()
        this.setData({
          isRefreshing: false
        })
        clearTimeout(timer)
      }, 500)
    })
  },
  //上拉加载
  onReachBottom() {
    this.param.page++
    this.getList()
  },
  onShareAppMessage: function (ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button")
      let i = ops.target.dataset.index
      let article = this.data.list[i]
      let bkid = article.id
      app.circle.addForward({ blog_id: bkid }).then(res => {
        if (res.code == 1) {
          let list = this.data.list
          list[i].forward += 1
          this.setData({
            list: list
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
  toUser(e) {
    if (this.data.$state.userInfo.id == e.currentTarget.dataset.item.uid) {
      wx.switchTab({
        url: "/pages/user/user"
      })
    } else {
      wx.navigateTo({
        url: `/pages/personPage/personPage?uid=${e.currentTarget.dataset.item.uid}&nickname=${e.currentTarget.dataset.item.nickname}&avatar=${e.currentTarget.dataset.item.avatar}`
      })
    }
  },
  showbig() {
    this.setData({
      showbig: true
    })
  },
  closeewm() {
    this.setData({
      showbig: false,
      showT: false
    })
  },
  longPress() {
    this.setData({
      showT: true
    })
  },
  closeT() {
    this.setData({
      showT: false
    })
  },
  saveImg() {
    let that = this
    wx.getImageInfo({
      src: this.data.circle.group_qrcode_image,
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success() {
            wx.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 1500
            })
            that.setData({
              showT: false
            })
          },
          fail() {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 1500
            })
          }
        })
      }
    })
  },
  //用于数据统计
  onHide() {
    // app.aldstat.sendEvent("退出", { name: "学友圈详情页" })
  },
  //收藏风采
  collect(e) {
    console.log(e)
    let blog_id = e.currentTarget.dataset.id, status = e.currentTarget.dataset.status, blog_index = e.currentTarget.dataset.index, flowId = e.currentTarget.dataset.userid, is_follow = e.currentTarget.dataset.follow, follownickname = e.currentTarget.dataset.name
    this.setData({
      blog_id,
      blog_index,
      flowId,
      is_follow,
      follownickname,
      showSheet: true,
      collectstatus: status
    })
  },
  cancelCollection() {
    let param = { blog_id: this.data.blog_id }
    app.circle.collectCancel(param).then(res => {
      if (res.code == 1) {
        thispagesCollect(this.data.blog_id, 0)
        this.postPages.pagesCollect(this.data.blog_id, 0)
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
  setCollect() {
    let param = {
      blog_id: this.data.blog_id
    }
    app.circle.collect(param).then(res => {
      if (res.code == 1) {
        thispagesCollect(this.data.blog_id, 1)
        this.postPages.pagesCollect(this.data.blog_id, 1)
        this.closeSheet()
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 1500
        })
      } else {
        this.closeSheet()
        wx.showToast({
          title: res.msg,
          image: '/images/warn.png',
          duration: 1500
        })
      }
    })
  },
  closeSheet() {
    this.setData({
      showSheet: false
    })
  },
  attention(e) {
    if (e.currentTarget.dataset.name) {
      this.setData({
        blog_index: e.currentTarget.dataset.index,
        flowId: e.currentTarget.dataset.userid,
        follownickname: e.currentTarget.dataset.name,
      })
    }
    let param = { follower_uid: this.data.flowId }
    app.user.following(param).then(res => {
      if (res.code == 1) {
        wx.showToast({
          title: '您已成功关注' + this.data.follownickname,
          icon: 'none',
          duration: 1500
        })
        this.setfollow(this.data.flowId, true)
        this.postPages.setfollow(this.data.flowId, true)
        this.closeSheet()
      }
    })
  },
  clsocancelFollowing() {
    let param = { follower_uid: this.data.flowId }
    app.user.cancelFollowing(param).then(res => {
      if (res.code == 1) {
        wx.showToast({
          title: '取消关注成功',
          icon: 'none',
          duration: 1500
        })
        this.setfollow(this.data.flowId)
        this.postPages.setfollow(this.data.flowId)
        this.closeSheet()
      }
    })
  },
  pagesCollect(id, type) {
    if (type) {
      let list = this.data.list, flowList = this.data.flowList
      list.forEach(item => {
        item.id == id ? item.collectstatus = 1 : ''
      })
      this.setData({
        list
      })
    } else {
      let list = this.data.list, flowList = this.data.flowList
      list.forEach(item => {
        item.id == id ? item.collectstatus = 0 : ''
      })
      this.setData({
        list
      })
    }
  },
  setfollow(id, follow) {
    if (follow) {
      this.data.list.forEach(item => {
        item.uid == id ? item.is_follow = 1 : ''
      })
      this.setData({
        list: this.data.list
      })
    } else {
      this.data.list.forEach(item => {
        item.uid == id ? item.is_follow = 0 : ''
      })
      this.setData({
        list: this.data.list
      })
    }
  },
})
