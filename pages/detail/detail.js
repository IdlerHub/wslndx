//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    sort: 0,
    nav: [{ name: "剧集" }, { name: "简介" }],
    height: 0,
    tip: true,
    rect: wx.getMenuButtonBoundingClientRect()
  },
  onLoad(options) {
    /*todo:考虑去掉that*/
    let that = this
    this.videoContext = wx.createVideoContext("myVideo")
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let query = wx.createSelectorQuery().in(this)
    query.select("#myVideo").boundingClientRect()
    query.select(".info").boundingClientRect()
    query.select(".nav").boundingClientRect()
    query.exec(res => {
      let videoHeight = res[0].height
      let infoHeight = res[1].height
      let navHeight = res[2].height + 10
      let scrollViewHeight = windowHeight - videoHeight - infoHeight - navHeight

      that.setData({
        vistor: options.type == "share", //游客从分享卡片过来
        height: scrollViewHeight,
        currentTab: 0,
        navScrollLeft: 0,
        id: options.id,
        curid: options.curid || null,
        cur: null
      })

      if (that.data.vistor) {
        setTimeout(() => {
          that.setData({
            tip: false
          })
        }, 15000)
      }

      wx.setNavigationBarTitle({
        title: options.name || ""
      })
      if (options.play) {
        that.setData({
          hideRecode: true
        })
        that.getDetail(function() {
          that.recordAdd()
        })
      } else if (that.data.$state.userInfo.mobile) {
        that.getDetail()
      }
    })
  },
  onGotUserInfo: function(e) {
    app.updateBase(e, this)
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
    let cur = event.detail.current
    this.setData({
      currentTab: cur
    })
  },
  getDetail() {
    this.param = {
      id: this.data.id,
      sort: this.data.sort
    }
    return app.classroom.detail(this.param).then(msg => {
      if (msg.code === 1) {
        msg.data.sublesson.forEach(function(item) {
          item.minute = (item.film_length / 60).toFixed(0)
        })
        wx.setNavigationBarTitle({
          title: msg.data.title
        })
        this.setData({
          detail: msg.data
        })
        this.manage()
      }
    })
  },
  ended() {
    this.setData({
      playing: false
    })
  },
  manage() {
    let detail = this.data.detail
    let current = 0,
      total = detail.sublesson.length,
      cur = ""
    detail.sublesson.forEach(item => {
      if (item.played == 1) {
        current++
      }
      if (item.id == detail.current_sublesson_id || item.id == this.data.curid) {
        cur = item
      }
    })
    if (detail.current_sublesson_id == 0 && !this.data.curid) {
      cur = detail.sublesson[0]
    }
    this.setData({
      "detail.progress": parseInt((current / total) * 100 + ""),
      cur: cur
    })
  },
  // 排序
  order() {
    this.setData({
      sort: this.data.sort === 0 ? 1 : 0
    })
    this.getDetail()
  },
  // 收藏
  collect() {
    /*todo:考虑去掉that*/
    let that = this
    let param = { lesson_id: this.param.id }
    if (this.data.detail.collected == 1) {
      wx.showModal({
        title: "",
        content: "是否取消收藏",
        success: function(res) {
          if (res.confirm) {
            app.classroom.collectCancel(param).then(msg => {
              if (msg.code == 1) {
                that.setData({
                  "detail.collected": 0
                })
              }
            })
          } else if (res.cancel) {
            return
          }
        }
      })
    } else {
      app.classroom.collect(param).then(msg => {
        if (msg.code == 1) {
          this.setData({
            "detail.collected": 1
          })
        }
      })
      //用于数据统计
      app.aldstat.sendEvent("课程收藏", { name: this.data.title })
    }
  },
  // 选择剧集
  select(e) {
    let i = e.currentTarget.dataset.index
    let list = this.data.detail.sublesson
    this.setData({
      cur: list[i]
    })
    this.recordAdd()
  },
  recordAdd() {
    let param = {
      lesson_id: this.param.id,
      sublesson_id: this.data.cur.id
    }
    app.classroom.recordAdd(param).then(msg => {
      if (msg.code == 1) {
        this.getDetail().then(() => {
          this.videoContext.play()
          this.setData({
            playing: true,
            hideRecode: true
          })
          app.addVisitedNum(`k${this.data.cur.id}`)
        })
      }
    })
  },
  navitor() {
    wx.navigateTo({
      url: "../certificate/certificate?name=" + this.data.detail.title
    })
  },
  onShareAppMessage: function(ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button")
      app.classroom.share({ lesson_id: this.data.id, sublesson_id: this.data.cur.id })
      return {
        title: this.data.detail.title,
        path: "/pages/detail/detail?id=" + this.data.id + "&curid=" + this.data.cur.id + "&type=share"
      }
    }
  },
  tohome: function() {
    wx.reLaunch({ url: "/pages/index/index" })
  },
  //用于数据统计
  onHide() {
    app.aldstat.sendEvent("退出", { name: "课程详情页" })
  }
})
