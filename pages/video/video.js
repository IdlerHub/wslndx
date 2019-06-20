//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    list: [],
    tip: true,
    vid: "short-video" + Date.now(),
    rect: wx.getMenuButtonBoundingClientRect()
  },
  onLoad(options) {
    this.videoContext = wx.createVideoContext(this.data.vid)
    let pages = getCurrentPages()
    let prePage = pages[pages.length - 2]
    if (prePage && prePage.route == "pages/videoItemize/videoItemize") {
      /* 从短视频分类页面过来 */
      this.setData({
        limit: true,
        home: options.home == "true"
      })
    } else {
      let share = options.type == "share"
      this.setData({
        vistor: share
      })
      if (share) {
        setTimeout(() => {
          this.setData({
            tip: false
          })
        }, 15000)
      }
    }

    if (this.data.$state.userInfo.mobile) {
      this.init(options)
    }
    app.aldstat.sendEvent("菜单", { name: "短视频" })
  },
  onShow() {},
  init(options) {
    this.param = { id: options.id ? options.id : "", page: 1, pageSize: 10, last_id: "" }
    return this.getList([]).then(() => {
      this.setData({
        cur: this.data.list[0],
        index: 0
      })
      app.addVisitedNum(`v${this.data.cur.id}`)
      app.aldstat.sendEvent("短视频播放", { name: this.data.cur.title })
    })
  },
  getList(list) {
    let temp = list || this.data.list
    return app.video.list(this.param).then(msg => {
      if (msg.code === 1 && msg.data) {
        msg.data.lists.forEach(function(item) {
          item.pw = app.util.tow(item.praise)
          item.fw = app.util.tow(item.forward)
          temp.push(item)
        })

        this.setData({
          list: temp
        })
        this.param.last_id = msg.data.last_id
      }
    })
  },
  tap() {
    console.log(this.data.vid)
    if (this.data.pause) {
      this.videoContext.play()
      this.setData({
        pause: false
      })
    } else {
      this.videoContext.pause()
      this.setData({
        pause: true
      })
    }
  },
  scrollTouchStart(e) {
    this.sy = e.touches[0].pageY
  },
  scrollTouchEnd(e) {
    let list = this.data.list
    let index = this.data.index
    this.ey = e.changedTouches[0].pageY
    if (this.ey - this.sy > 30) {
      // 下拉
      this.setData({
        cur: index <= 0 ? list[0] : list[index - 1],
        index: index <= 0 ? 0 : index - 1,
        pause: false
      })
    } else if (this.ey - this.sy < -30) {
      // 上拉
      let temp = index >= list.length - 1 ? 0 : index + 1
      this.setData({
        cur: list[temp],
        index: temp,
        pause: false
      })
      if (temp == list.length - 2) {
        // 加载新数据
        this.param.page += 1
        this.param.id = ""
        this.getList()
      }
    }
    app.addVisitedNum(`v${this.data.cur.id}`)
    app.aldstat.sendEvent("短视频播放", { name: this.data.cur.title })
  },
  praise() {
    let list = this.data.list
    let index = this.data.index
    let param = {
      id: list[index].id
    }
    if (list[index].praised == 1) {
      // 取消点赞
      app.video.delPraise(param).then(msg => {
        if (msg.code == 1) {
          list[index].praised = 0
          list[index].praise--
          this.setData({
            list: list,
            cur: list[index]
          })
        }
      })
    } else {
      // 点赞
      app.video.praise(param).then(msg => {
        if (msg.code == 1) {
          list[index].praised = 1
          list[index].praise++
          list[index].praising = true
          this.setData({
            list: list,
            cur: list[index]
          })
        }
      })
      app.aldstat.sendEvent("短视频点赞", { name: this.data.cur.title })
    }
  },
  aniend(e) {
    let list = this.data.list
    let index = this.data.index
    list[index].praising = false
    this.setData({
      list: list,
      cur: list[index]
    })
  },
  // 转发
  onShareAppMessage: function(ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button")
      let list = this.data.list
      let index = this.data.index
      let param = {
        id: list[index].id
      }
      app.video.share(param).then(msg => {
        if (msg.code == 1) {
          list[index].forward += 1
          this.setData({
            list: list,
            cur: list[index]
          })
          app.aldstat.sendEvent("短视频转发", { name: this.data.cur.title })
        }
      })
      return {
        title: list[index].title,
        path: "/pages/video/video?id=" + list[index].id + "&type=share"
      }
    }
  },
  // 首页
  tohome() {
    wx.reLaunch({ url: "/pages/index/index" })
  },
  // 短视频分类
  navigate() {
    /* 只能迭代一层 */
    if (this.data.limit) return
    wx.navigateTo({
      url: "/pages/videoItemize/videoItemize?categoryId=" + this.data.cur.category_id + "&share=" + this.data.vistor
    })
  },
  // 完整视频
  complete() {
    let cur = this.data.cur
    wx.navigateTo({
      url: "../detail/detail?id=" + cur.target_id
    })
  },
  // 用于数据统计
  onHide() {
    app.aldstat.sendEvent("退出", { name: "短视频页" })
  },
  // 获取用户的微信昵称头像
  onGotUserInfo: function(e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.updateBase(e, this)
    }
  }
})
