const app = getApp()
//Page Object
Page({
  data: {
    currentTab: 1,
    scrollStatus: false,
    sources: [
      {
        title: "邀请好友注册",
        score: 25,
        status: false,
        page: "/pages/invitation/invitation"
      },
      {
        title: "分享课程",
        score: 10,
        times: 3,
        status: false,
        page: "/pages/index/index?tabs=1"
      },
      {
        title: "每日签到获得积分",
        score: 10,
        status: false
      },
      {
        title: "注册完成获得积分",
        score: 20,
        status: true
      }
    ],
    paylist: [],
    details: [],
    isRefreshing: false
  },
  params: {
    scrollTop: 175
  },
  //options(Object)
  onLoad: function(options) {
    app.user.gift().then(res => {
      if (res.code == 1) {
        res.data.forEach(item => {
          item.largePoint = item.need_points >= 10000 ? (item.need_points / 10000).toFixed(2) + "w" : null
        })
        this.setData({
          paylist: res.data,
          "sources[2].status": this.data.$state.signStatus.status /* 用户签到状态 */
        })
      }
    })
  },
  onShow: function() {
    this.init()
  },
  init() {
    let shareLessions = wx.getStorageSync("shareLessions") || {}
    /* 今天分享课程次数 */
    if (shareLessions.time == new Date().toDateString()) {
      let remain = 3 - shareLessions.count
      this.setData({
        "sources[1].times": remain > 0 ? remain : 0,
        "sources[1].status": remain <= 0
      })
    }
    return app.user.pointsinfo().then(res => {
      if (res.code == 1) {
        res.data.lists.forEach(v => {
          v.time = app.util.formatTime(new Date(v.createtime * 1000))
        })
        this.setData({
          totalPoints: res.data.mypoints,
          details: res.data.lists
        })
      }
    })
  },
  onHide: function() {},
  onPullDownRefresh: function() {
    this.setData({
      isRefreshing: true
    })

    this.init().then(() => {
      wx.stopPullDownRefresh()
      this.setData({
        isRefreshing: false
      })
    })
  },
  onReachBottom: function() {
    this.setData({
      scrollStatus: true
    })
  },
  onPageScroll: function(e) {
    if (e.scrollTop < this.params.scrollTop) {
      this.data.scrollStatus && this.setData({ scrollStatus: false })
    }
  },
  switchTap(e) {
    let id = e.currentTarget.dataset.index
    if (id != this.data.currentTab) {
      this.setData({
        currentTab: id
      })
    }
  },
  swiperChange(e) {
    let id = e.detail.currentItemId
    if (id != this.data.currentTab) {
      this.setData({
        currentTab: id
      })
    }
  },
  gift(e) {
    if (!e.currentTarget.dataset.stock) {
      wx.showToast({
        title: "已经没货啦～",
        icon: "none",
        duration: 1500
      })
    } else {
      if (this.data.totalPoints > e.currentTarget.dataset.score) {
        let param = { gift_id: e.currentTarget.dataset.id }
        wx.showModal({
          title: "兑换提示",
          content: "确定要兑换该物品吗?",
          showCancel: true,
          cancelText: "暂时不换",
          cancelColor: "#000000",
          confirmText: "确定兑换",
          confirmColor: "#df2020",
          success: res => {
            if (res.confirm) {
              app.user.exchange(param).then(res => {
                if (res.code == 1) {
                  wx.navigateTo({
                    url: "/pages/gift/gift"
                  })
                }
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: "您的积分不够兑换!",
          icon: "none",
          duration: 1500
        })
      }
    }
  },
  nav(e) {
    let i = e.currentTarget.dataset.index
    if (i == 2) {
      /* 签到状态 */
      app.setSignIn({ status: true, count: 1 }, true)
      this.setData({
        "sources[2].status": true
      })
      app.user.sign().then(res => {
        this.init()
      })
    } else {
      wx.navigateTo({
        url: this.data.sources[i].page
      })
    }
  }
})
