/*
 * @Date: 2019-06-14 19:54:05
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-13 16:27:52
 */
//获取应用实例
const app = getApp()
Page({
  data: {
    rlSucFlag: false,
    isRefreshing: false
  },
  onLoad(options) {
    this.param = { page: 1, pageSize: 10 }
    this.setData({
      list: []
    })
    /* 从cdetail-->发帖 */
    if (options.rlSuc) {
      this.setData({ rlSucFlag: true })
    }
    this.getList([])
    app.aldstat.sendEvent("菜单", { name: "风采展示" })
  },
  onShow: function() {
    if (this.data.rlSucFlag) {
      this.rlSuc()
      /* 确保动画只执行一次 */
      this.setData({ rlSucFlag: false })
    }
  },
  onShareAppMessage: function(ops, b) {
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
        path: "/pages/pDetail/pDetail?id=" + bkid + "&type=share"
      }
    }
  },
  getList(list) {
    let temp = list || this.data.list
    return app.circle.news(this.param).then(msg => {
      if (msg.code == 1) {
        if (msg.data) {
          msg.data.forEach(function(item) {
            item.fw = app.util.tow(item.forward)
            item.cw = app.util.tow(item.comments)
            item.lw = app.util.tow(item.likes)
            item.images = item.images.map(i => {
              return i.image
            })
            item.auditing = new Date().getTime() - new Date(item.createtime * 1000) < 7000
          })
          this.setData({
            list: temp.concat(msg.data)
          })
        }
      }
    })
  },
  praise(e) {
    let i = e.currentTarget.dataset.index
    let list = this.data.list
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
            list: list
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
          app.socket.send(list[i].uid)
          this.setData({
            list: list
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
    var list = this.data.list
    list[i].praising = false
    this.setData({
      list: list
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
    /* 重新到第一页 */
    this.param.page = 1
    this.getList([]).then(() => {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
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
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: "../pDetail/pDetail?id=" + id
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
        this.setData({
          isRefreshing: false
        })
        clearTimeout(timer)
      }, 1000)
    })
  },
  //上拉加载
  onReachBottom() {
    this.param.page++
    this.getList()
  },
  toUser(e) {
    if (this.data.$state.userInfo.id == e.currentTarget.dataset.uid) {
      wx.navigateTo({
        url: "/pages/user/user"
      })
    }
  },
  toMessage() {
    wx.navigateTo({
      url: "/pages/message/message"
    })
  },
  //用于数据统计
  onHide() {
    app.aldstat.sendEvent("退出", { name: "秀风采页" })
  },
  onUnload() {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  }
})
