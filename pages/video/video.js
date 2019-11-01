//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    list: [],
    tip: true,
    vid: "short-video" + Date.now(),
    top: 27,
    pause:false,
    showGuide: true,
    nextRtight:1,
    currentTab:0
    /*  rect: wx.getMenuButtonBoundingClientRect() */
  },
  onLoad(options) {
    let systemInfo = wx.getSystemInfoSync()
    systemInfo.statusBarHeight == 20 ? '' : this.setData({
      top: 48
    })
    this.videoContext = wx.createVideoContext(this.data.vid)
    this.getCategory()
    let pages = getCurrentPages()
    let prePage = pages[pages.length - 2]
    if (prePage && prePage.route == "pages/videoItemize/videoItemize") {
      /* 从短视频分类页面过来 */
      this.setData({
        limit: true,
        home: options.home == "true"
      })
      this.param = { type: "category", id: options.id, pageSize: 10, position: "first", include: "yes", categoryId: options.categoryId }
    } else {
      /* 短视频推荐 */
      let share = options.type == "share"
      this.setData({
        vistor: share
      })
      /* 分享卡片进来,提示持续15秒 */
      if (share) {
        setTimeout(() => {
          this.setData({
            tip: false
          })
        }, 5000)
      }
      this.param = { type: "recommend", id: options.id ? options.id : "", page: 1, pageSize: 10, last_id: "" }
    }

    if (this.data.$state.userInfo.mobile) {
      /* 已登录 */
      this.getList([]).then(() => {
        this.setData({
          cur: this.data.list[0],
          index: 0
        })
        app.addVisitedNum(`v${this.data.cur.id}`)
        app.aldstat.sendEvent("短视频播放", { name: this.data.cur.title })
      })
    }
    app.aldstat.sendEvent("菜单", { name: "短视频" })
  },
  getList(list) {
    let temp = list || this.data.list
    if (this.data.limit) {
      return app.video.category(this.param).then(msg => {
        this.callback(msg, temp)
        return msg
      })
    } else {
      return app.video.list(this.param).then(msg => {
        this.callback(msg, temp)
      })
    }
  },
  getCategory() {
    app.video.categoryMore().then(res =>{
      
    })
  },
  callback(msg, temp) {
    if (msg.code === 1 && msg.data && msg.data.lists) {
      msg.data.lists.forEach(function(item) {
        item.pw = app.util.tow(item.praise)
        item.fw = app.util.tow(item.forward)
      })

      this.setData({
        list: this.param.position == "end" ? (msg.data.lists || []).concat(temp) : temp.concat(msg.data.lists || [])
      })
      this.param.last_id = msg.data.last_id
    }
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
    console.log(e)
    let list = this.data.list
    let index = this.data.index
    this.ey = e.changedTouches[0].pageY
    if (this.ey - this.sy > 30) {
      // 下拉

      if (this.param.type == "category" && index == 0) {
        this.param.id = list[0].id
        this.param.position = "end"
        this.param.include = "no"
        this.getList().then(data => {
          if (data.data && data.data.lists) {
            if (data.data.lists.length == 0) {
              /*  已经是第一个了  */
            } else if (data.data.lists.length > 0) {
              this.setData({
                cur: this.data.list[data.data.lists.length - 1],
                index: data.data.lists.length - 1,
                pause: false
              })
            }
          }
        })
      } else {
        this.setData({
          cur: index <= 0 ? list[0] : list[index - 1],
          index: index <= 0 ? 0 : index - 1,
          pause: false
        })
      }
    } else if (this.ey - this.sy < -30) {
      // 上拉
      let temp = index >= list.length - 1 ? (this.param.type == "recommend" ? 0 : index) : index + 1
      this.setData({
        cur: list[temp],
        index: temp,
        pause: false
      })
      if (temp == list.length - 2) {
        //还剩下一个视频时,加载新数据
        if (this.param.type == "recommend") {
          this.param.page += 1
          this.param.id = ""
        } else {
          this.param.id = list[list.length - 1].id
          this.param.position = "first"
          this.param.include = "no"
        }
        this.getList()
      }
    }
    app.addVisitedNum(`v${this.data.cur.id}`)
    app.aldstat.sendEvent("短视频播放", { name: this.data.cur.title })
  },
  praise() {
    let list = this.data.list
    let index = this.data.index
    let param1 = {
      id: list[index].id
    }
    if (list[index].praised == 1) {
      // 取消点赞
      app.video.delPraise(param1).then(msg => {
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
      app.video.praise(param1).then(msg => {
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
      let param2 = {
        id: list[index].id
      }
      app.video.share(param2).then(msg => {
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
        path: "/pages/video/video?id=" + list[index].id + "&type=share&uid=" + this.data.$state.userInfo.id
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
  //指引
  closeGuide(e) {
    let type = e.currentTarget.dataset.type
    this.data.nextRtight == 4 ? this.setData({
      showGuide: false
    }) : type == 'once' ? this.setData({
        showGuide: false
    }) : ''
    this.data.showGuide == false ? this.videoContext.play() : ''
  },
  nextGuide(e){
    let type = e.currentTarget.dataset.type
    if (type == 1) {
      this.setData({
        nextRtight: 2
      })
    } else if(type == 2) {
      this.setData({
        nextRtight: 3
      })
    } else if (type == 3) {
      this.setData({
        nextRtight: 4
      })
    }
  },
  // 获取用户的微信昵称头像
  onGotUserInfo: function(e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.updateBase(e)
    }
  },
  onUnload() {
  },
  switchNav(event) {
    let cur = event.currentTarget.dataset.current
    if (this.data.currentTab === cur) {
      return false
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  switchTab(event) {
    this.tap()
    let cur = event.detail.current
    this.setData({
      currentTab: cur
    })
  },
})
