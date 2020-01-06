//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    list: [],
    circle: null,
    isRefreshing: false,
    showT: false
  },
  onLoad(options) {
    this.id = options.id
    this.param = { fs_id: this.id, page: 1, pageSize: 10 }
    this.getList([])
    this.getCircleInfo().then(() => {
      wx.setNavigationBarTitle({
        title: this.data.circle.title
      })
    })
  },
  onUnload() {},
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
  getList: function(list) {
    let temp = list || this.data.list
    return app.circle.news(this.param).then(msg => {
      if (msg.code === 1 && msg.data) {
        msg.data.forEach(function(item) {
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
  onShareAppMessage: function(ops) {
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
    if (this.data.$state.userInfo.id == e.currentTarget.dataset.uid) {
      wx.switchTab({
        url: "/pages/user/user"
      })
    }
  },
  showbig() {
    this.setData({
      showbig:true
    })
  },
  closeewm() {
    this.setData({
      showbig:false,
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
      success (res) {
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
    app.aldstat.sendEvent("退出", { name: "学友圈详情页" })
  },
})
