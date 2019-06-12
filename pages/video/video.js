//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    list: [],
    limit: false
  },
  onLoad(options) {
    this.videoContext = wx.createVideoContext("myVideo")
    this.param = { id: options.id ? options.id : "", page: 1, pageSize: 10, last_id: "" }
    this.getList([]).then(() => {
      this.setData({
        cur: this.data.list[0],
        index: 0,
        vistor: options.type == "share"
      })
      app.addVisitedNum(`v${this.data.cur.id}`)
      app.aldstat.sendEvent("短视频播放", { name: this.data.cur.title })
    })
    app.aldstat.sendEvent("菜单", { name: "短视频" })
  },
  onShow() {
    if (!!this.data.cur && this.data.cur.fs_joined == 1) {
      let arr = this.data.list
      arr.forEach((item, index) => {
        if (item.fs_id == this.data.cur.fs_id) {
          item.fs_joined = 1
        }
        let temp = "list[" + index + "]"
        this.setData({
          [temp]: item,
          list: arr
        })
      })
      app.aldstat.sendEvent("加圈", { name: this.data.cur.title })
    }
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
      this.setData({
        cur: index >= list.length - 1 ? list[0] : list[index + 1],
        index: index >= list.length - 1 ? 0 : index + 1,
        pause: false
      })
      if (index >= list.length - 2) {
        // 加载新数据
        this.param.page++
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
  onShareAppMessage: function() {
    let list = this.data.list
    let index = this.data.index
    let param = {
      id: list[index].id
    }
    // 分享  todo:iphoneX有卡顿bug
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
      imageUrl: list[index].cimg,
      path: "/pages/video/video?id=" + list[index].id + "&type=share"
    }
  },
  // 首页
  tohome() {
    wx.reLaunch({ url: "/pages/index/index" })
  },
  // 跳转学友圈
  navigate() {
    if (!this.data.$state.authUserInfo) {
      /* 要求授权 */
      this.setData({
        limit: true
      })
      return
    }
    let cur = this.data.cur
    app.aldstat.sendEvent("短视频跳转", { name: this.data.cur.title })
    wx.navigateTo({
      url: "../cDetail/cDetail?id=" + cur.fs_id
    })
  },
  // 加入学友圈
  join() {
    let cur = this.data.cur
    wx.navigateTo({
      url: "../cDetail/cDetail?id=" + cur.fs_id + "&join=true"
    })
  },
  // 完整视频
  complete() {
    let cur = this.data.cur
    wx.navigateTo({
      url: "../detail/detail?id=" + cur.target_id
    })
  },
  result() {
    let list = this.data.list
    let index = this.data.index
    list[index].fs_joined = 1
    this.setData({
      list: list,
      cur: list[index]
    })
  },
  //用于数据统计
  onHide() {
    app.aldstat.sendEvent("退出", { name: "短视频页" })
  },
  //获取用户的昵称头像
  onGotUserInfo: function(e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.updateBase(e, this)
      if (this.data.limit) {
        this.setData({
          limit: false
        })
        let cur = this.data.cur
        app.aldstat.sendEvent("短视频跳转", { name: this.data.cur.title })
        wx.navigateTo({
          url: "../cDetail/cDetail?id=" + cur.fs_id
        })
      }
    }
  }
})
