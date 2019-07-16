//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    nav: [{ name: "推荐", class: ".recommend" }, { name: "分类", class: ".category" }],
    height: 0,
    isRefreshing: false,
    activity: ""
  },
  navHeightList: [],
  onLoad: async function(e) {
    await app.user.signed().then(res => {
      let sign = res.data && res.data.signed
      app.setSignIn({ status: sign, count: sign ? 1 : this.data.$state.signStatus.count }, true)
    })
    this.param = { page: 1, pageSize: 10 }
    let reg = /ios/i
    let pt = 20 //导航状态栏上内边距
    let h = 44 //导航状态栏高度
    let systemInfo = wx.getSystemInfoSync()
    pt = systemInfo.statusBarHeight
    if (!reg.test(systemInfo.system)) {
      h = 48
    }
    this.setData({
      top: pt + h
    })
    let windowHeight = systemInfo.windowHeight
    let that = this
    let query = wx.createSelectorQuery().in(this)
    query.select(".top").boundingClientRect()
    query.select(".nav").boundingClientRect()
    query.exec(res => {
      that.headerHeight = res[0].height
      that.navHeight = res[1].height
    })
    this.setData({
      recommend: [],
      category: [],
      history: {},
      currentTab: e.tabs || 0 /* 从积分页面过来的直接去分类 */,
      navScrollLeft: 0
    })
    this.init()
  },
  onReady: function() {
    setTimeout(wx.hideLoading, 500)
  },
  onShow() {
    /* 更新用户的视频浏览历史 */
    this.getHistory()
  },
  init() {
    return Promise.all([this.getactivite(), this.getRecommend(), this.getCategory()]).then(values => {
      this.setData({
        activity: values[0].data
      })
      this.navHeightList = []
      this.setHeight()
    })
  },
  setHeight() {
    let nav = this.data.nav
    let currentTab = this.data.currentTab
    if (this.navHeightList[currentTab]) {
      this.setData({
        height: this.navHeightList[currentTab]
      })
    } else {
      let query = wx.createSelectorQuery().in(this)
      let that = this
      query.select(nav[currentTab].class).boundingClientRect()
      query.exec(res => {
        let height = res[0].height
        that.navHeightList[currentTab] = height
        that.setData({
          height: height
        })
      })
    }
  },
  switchNav(event) {
    let cur = event.currentTarget.dataset.current
    if (this.data.currentTab !== cur) {
      this.setData({
        currentTab: cur
      })
    }
  },
  getFeatureCode(e) {
    console.log(e)
    console.log(e.detail.formId)
  },
  switchTab(event) {
    let cur = event.detail.current
    this.setData({
      currentTab: cur
    })
    this.setHeight()
  },
  getRecommend() {
    return app.classroom.recommend(this.param).then(msg => {
      if (msg.code == 1) {
        msg.data.forEach(function(item) {
          item.bw = app.util.tow(item.browse)
        })
        this.setData({
          recommend: msg.data
        })
      }
    })
  },
  getCategory() {
    return app.classroom.category().then(msg => {
      if (msg.code == 1) {
        msg.data.forEach((v, i) => {
          let t = v.lists.length
          let r = v.lists.length % 3
          v.lists.length = r ? t + (3 - r) : t
        })
        this.setData({
          category: msg.data
        })
      }
    })
  },
  getactivite() {
    return app.user.activite()
  },
  getHistory() {
    let historyParam = { page: 1, pageSize: 10 }
    return app.user.history(historyParam).then(msg => {
      if (msg.code == 1) {
        this.setData({
          "history.last_lesson": msg.data.last_lesson || ""
        })
      }
    })
  },
  toUser() {
    wx.navigateTo({
      url: "../user/user"
    })
  },
  toInfo() {
    wx.navigateTo({
      url: "../info/info"
    })
  },
  toVideo() {
    wx.navigateTo({
      url: "../video/video"
    })
  },
  toPost() {
    wx.navigateTo({
      url: "../post/post"
    })
  },
  onPageScroll(e) {
    if (e.scrollTop >= this.headerHeight - this.navHeight) {
      !this.data.scroll &&
        this.setData({
          scroll: true
        })
    } else {
      this.data.scroll &&
        this.setData({
          scroll: false
        })
    }
  },
  //继续播放
  historyTap: function(e) {
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.id}&name=${e.currentTarget.dataset.title}&play=true`
    })
    //用于数据统计
    app.aldstat.sendEvent("继续播放", { name: e.currentTarget.dataset.title })
  },
  //点击推荐课堂
  detailTap: function(e) {
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.item.id}&name=${e.currentTarget.dataset.item.title}`
    })
    //用于数据统计
    app.aldstat.sendEvent("推荐栏目课程点击", {
      name: e.currentTarget.dataset.item.title
    })
  },
  //分类点击
  categoryTap: function(data) {
    data.currentTarget.dataset.item &&
      data.currentTarget.dataset.item.id &&
      wx.navigateTo({
        url: `../category/category?id=${data.currentTarget.dataset.item.id}&name=${data.currentTarget.dataset.item.name}&img=${data.currentTarget.dataset.item.top_image}`
      })
    //用于数据统计
    app.aldstat.sendEvent("点击分类按钮", { name: "点击分类按钮" })
  },
  //用于数据统计
  onHide() {
    app.aldstat.sendEvent("退出", { name: "首页" })
  },
  // 用户昵称等信息授权
  onGotUserInfo(e) {
    if (e.detail.errMsg === "getUserInfo:ok") {
      app.updateBase(e)
      if (e.currentTarget.dataset.role == "user") {
        this.toUser()
      } else if (e.currentTarget.dataset.role == "post") {
        this.toPost()
      } else {
        this.toEducation()
      }
    }
  },
  /* 签到 */
  signIn(data) {
    let sign = data.currentTarget.dataset.id == 1
    app.setSignIn({ status: sign, count: 1 }, true)
    if (sign) {
      app.user.sign().then(res => {
        if (res.code == 1) {
          /* 前往积分页面 */
          wx.navigateTo({ url: "/pages/score/score" })
        } else {
          wx.showToast({
            title: res.msg,
            icon: "none",
            duration: 1500,
            mask: true
          })

          let timer = setTimeout(() => {
            wx.hideToast({
              success: () => {
                wx.navigateTo({ url: "/pages/score/score" })
              }
            })
            clearTimeout(timer)
          }, 1500)
        }
      })
    }
  },
  toEducation() {
    wx.navigateTo({
      url: "/pages/education/education"
    })
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
    this.setData({
      isRefreshing: true
    })
    this.init().then(() => {
      let timer = setTimeout(() => {
        this.setData({
          isRefreshing: false
        })
        clearTimeout(timer)
      }, 1000)
    })
  },
  onReachBottom() {}
})
