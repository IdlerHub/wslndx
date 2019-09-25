/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-13 14:32:02
 */
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
    app.aldstat.sendEvent("退出", { name: "风采展示" })
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
            item.fw = app.util.tow(item.forward)
            item.cw = app.util.tow(item.comments)
            item.lw = app.util.tow(item.likes)
            item.images = item.images.map(i => {
              return i.image
            })
            item.auditing = new Date().getTime() - new Date(item.createtime * 1000) < 7000
            circle.push(item)
          })
        }
        this.setData({
          circle: circle
        })
      } else if (msg.code == -2) {
        this.setData({
          circle: []
        })
      }
    })
  },
  //图片预览
  previewImage(e) {
    let that = this
    let urls = e.currentTarget.dataset.urls
    let current = e.currentTarget.dataset.current
    wx.previewImage({
      current: current,
      urls: urls // 需要预览的图片http链接列表
    })
  },
  navigate(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "../pDetail/pDetail?id=" + id
    })
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
              circle.splice(i, 1)
              this.setData({
                circle: circle
              })
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
  },
  onShareAppMessage: function(ops, b) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button")
      let i = ops.target.dataset.index
      let article = this.data.circle[i]
      let bkid = article.id
      app.circle.addForward({ blog_id: bkid }).then(res => {
        if (res.code == 1) {
          let list = this.data.circle
          list[i].forward += 1
          this.setData({
            circle: list
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
  praise(e) {
    let i = e.currentTarget.dataset.index
    let list = this.data.circle
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
            circle: list
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
          this.setData({
            circle: list
          })
        }
      })
    }
  },
  aniend(e) {
    var i = e.currentTarget.dataset.index
    var list = this.data.circle
    list[i].praising = false
    this.setData({
      list: list
    })
  },
  unShare() {
    wx.showToast({
      title: "非常抱歉，不能分享这个内容！",
      icon: "none",
      duration: 1500
    })
  }
})
