//index.js

const Tutor = require("../../data/Tutor")

//获取应用实例
const app = getApp()
Page({
  data: {
    isRefreshing: false,
    showReco: false,
    guidetxt: '下一步',
    shownow: true,
    shownowt: true,
    showdialog: true,
    showSignbox: false,
    centerIcon: [{
      url: '/page/index/pages/allLesson/allLesson',
      icon: '/images/indexIcon/allLessonIcon.png',
      name: '全部课程'
    }, {
      url: '/pages/video/video',
      icon: '/images/indexIcon/sortVideoicon.png',
      name: '短视频 '
    }, {
      url: '/page/index/pages/schoolLesson/schoolLesson',
      icon: '/images/indexIcon/shollLesson.png',
      name: '高校课程'
    }, {
      url: '/page/index/pages/hotActivity/hotActivity',
      icon: '/images/indexIcon/hotActivityIcon.png',
      name: '热门活动'
    }, ]
  },
  pageName: '首页',
  guide: 0,
  liveTimer: '',
  nextTapDetial: {
    type: '',
    detail: {}
  },
  onLoad: function (e) {
    e.type != undefined ? this.pageType = e.type : ''
    let reg = /ios/i
    let pt = 20 //导航状态栏上内边距
    let h = 44 //导航状态栏高度
    let systemInfo = wx.getSystemInfoSync()
    pt = systemInfo.statusBarHeight
    if (!reg.test(systemInfo.system)) {
      h = 48
    }
    systemInfo.statusBarHeight < 30 ?
      this.setData({
        topT: 28
      }) :
      this.setData({
        topT: 48
      });
    this.setData({
      top: pt + h
    })
    let roomId = 1
    let windowHeight = systemInfo.windowHeight
    let that = this
    let query = wx.createSelectorQuery().in(this)
    query.select(".top").boundingClientRect()
    query.exec(res => {
      that.headerHeight = res[0].height + pt + h
    })
    this.setData({
      liveRecommend: [],
      sprogInterestList: [],
      interestList: [],
      category: [],
      history: {},
    })
    this.init()
  },
  onShow() {
    /* 更新用户的视频浏览历史 */
    if (app.store.$state.userInfo.mobile) {
      this.getHistory()
      app.getUserOpenData()
      setTimeout(wx.hideLoading, 500)
      this.setData({
        showSignbox: true
      })
      this.data.isSign ? this.signIn() : ''
    }
  },
  init() {
    if (this.data.$state.userInfo.mobile) {
      Promise.all([this.getRecommendLessons(1), this.getinterestList(), this.getBanner(), this.getDialog(), this.getUserOpenid()]).then(values => {
        app.user.signed().then(res => {
          let sign = res.data && res.data.signed
          app.store.setState({
            signdays: res.data.sign_days
          })
          app.setSignIn({
            status: sign,
            count: sign ? 1 : this.data.$state.signStatus.count
          }, true)
          app.store.setState({
            showSignbox: !sign
          }, () => {
            app.user.share({}).then(res => {
              app.setShare(res)
            })
          })
        })
      })
    } else {
      Promise.all([this.getRecommendLessons(1), this.getinterestList(), this.getBanner()])
    }
  },
  centerTab(e) {
    this.setData({
      bannercurrentTab: e.detail.current
    })
  },
  getinterestList() {
    return app.lessonNew.interestList().then(res => {
      this.setData({
        interestList: res.data.interestList,
        sprogInterestList: res.data.sprogInterestList
      })
    })
  },
  getUserOpenid() {
    app.user.myIndex().then(res => {
      app.store.setState({
        userIndex: res.data
      })
    })
  },
  getRecommendLessons(type) {
    if (this.data.liveRecommend[0] && !type) {
      setInterval(() => {
        app.liveData.recommendLessons().then(res => {
          this.setData({
            liveRecommend: res.dataList.slice(0, 6)
          })
        })
      }, 60000);
    } else {
      app.liveData.recommendLessons().then(res => {
        this.setData({
          liveRecommend: res.dataList.slice(0, 8)
        }, () => {
          res.dataList.length > 0 ? this.getRecommendLessons() : ''
        })
      })
    }

  },
  getBanner() {
    this.setData({
      bannercurrentTab: 0
    })
    return app.lessonNew.getBannerList({}).then(res => {
      this.setData({
        imgUrls: res.dataList
      })
    })
  },
  getHistory() {
    let historyParam = {
      page: 1,
      pageSize: 10
    }
    return app.user.history(historyParam).then(msg => {
      this.setData({
        "history.last_lesson": msg.data.last_lesson || ""
      })
    })
  },
  toUser() {
    wx.switchTab({
      url: "../user/user"
    })
  },
  toInfo() {
    wx.navigateTo({
      url: "../../page/user/pages/info/info"
    })
  },
  touchstart() {
    this.shownow = true
  },
  touchend() {
    this.shownow = false
  },
  onPageScroll(e) {
    if (e.scrollTop >= this.headerHeight) {
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
    if (e.scrollTop < 0) return
    let scrollTop = this.scrollTop
    this.scrollTop = e.scrollTop
    e.scrollTop - scrollTop > 0 ? this.data.shownow && this.setData({
      shownow: false
    }) : !this.data.shownow && this.shownow && this.setData({
      shownow: true
    })
  },
  //继续播放
  historyTap: function (e) {
    wx.navigateTo({
      url: `/page/index/pages/detail/detail?id=${e.currentTarget.dataset.id}&name=${e.currentTarget.dataset.title}&play=true`
    })
    wx.uma.trackEvent('video_historyPlay', {
      lessonsName: e.currentTarget.dataset.title
    });
  },
  closenow() {
    this.setData({
      shownowt: false
    })
  },
  //用于数据统计
  onHide() {},
  // 用户昵称等信息授权
  onGotUserInfo(e) {
    if (e.detail.errMsg === "getUserInfo:ok") {
      app.updateBase(e)
      if (e.currentTarget.dataset.role == "user") {
        this.toUser()
      } else if (e.currentTarget.dataset.role == "post") {
        this.toPost()
      } else if (e.currentTarget.dataset.type == "score") {
        wx.navigateTo({
          url: '/page/user/pages/score/score',
        })
      } else if (e.currentTarget.dataset.type == "banner") {
        let item = e.currentTarget.dataset.item;
        if (item.jump_type == '5') {
          wx.navigateTo({
            url: item.clickurl,
          })
        } else {
          setTimeout(() => {
            wx.navigateTo({
              url: `../education/education?url=${item.clickurl}&login=${item.is_login}&id=0&type=1`
            })
          }, 500);
        }
        wx.uma.trackEvent('index_bannerClick', {
          bannerTencent: item.title
        });
      }
    }
  },
  /* 签到 */
  closeSignIn() {
    app.setSignIn({
      status: 0,
      count: 0
    }, true)
    this.setData({
      showdialog: false,
      showSignbox: false,
      dialog: []
    })
  },
  signIn(data) {
    app.setSignIn({
      status: true,
      count: 1
    }, true)
    app.user.sign().then(res => {
      console.log('签到成功')
      app.store.setState({
        signdays: res.data.sign_days
      })
      this.showIntegral()
    })
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
    this.setData({
      isRefreshing: true,
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
  onReachBottom() {
    this.setData({
      onReachBottom: true
    })
    setTimeout(() => {
      this.setData({
        onReachBottom: false
      })
    }, 1000)
  },
  /* 广告位值跳转 */
  bannerGo(e) {
    let item = e.currentTarget.dataset.item;
    if (item.jumpType == 1) {
      /* 外链 */
      wx.navigateTo({
        url: `../education/education?type=0&url=${item.clickurl}&login=${item.is_login}`
      })
      wx.uma.trackEvent('index_bannerClick', {
        bannerTencent: item.title
      });
    } else if (item.jumpType == 2) {
      /* 视频 */
      wx.navigateTo({
        url: `../../page/index/pages/detail/detail?id=${item.video_id}&name=${item.title}`
      })
      wx.uma.trackEvent('index_bannerClick', {
        bannerVideo: item.title
      });
    } else if (item.jumpType == 4) {
      this.minigo(item.clickurl)
      wx.uma.trackEvent('index_bannerClick', {
        bannerMini: item.title
      });
    } else if (item.jumpType == 5) {
      wx.navigateTo({
        url: item.clickurl,
      })
      wx.uma.trackEvent('index_bannerClick', {
        bannerActivity: item.title
      });
    } else if (item.jumpType == 6) {
      this.toLive(item.clickurl)
    } else {
      /* 文章 */
      wx.navigateTo({
        url: "../../page/post/pages/pDetail/pDetail?id=" + item.articleId
      })
      wx.uma.trackEvent('index_bannerClick', {
        bannerBlog: item.title
      });
    }
  },
  // 跳友方小程序
  jumpmini() {
    this.minigo('{"appid":"wx7d6c683879173db6","url":""}')
    wx.uma.trackEvent('index_btnClick', {
      btnName: '斗地主'
    });
  },
  minigo(url) {
    console.log(JSON.parse(url), url)
    let system = JSON.parse(url)
    wx.navigateToMiniProgram({
      appId: system.appid,
      path: system.url,
      // envVersion: 'trial',
    })
  },
  /*获取首页活动弹框 */
  getDialog() {
    if (this.pageType) return
    app.user.dialog().then(res => {
      res.data[0] ?
        this.setData({
          dialog: res.data,
          showdialog: true
        }) : 0
    })
  },
  jumpPeper(e) {
    if (e.currentTarget.dataset.type == 'dialog') {
      let dialog = e.currentTarget.dataset.peper
      dialog.jump_type == 1 ? wx.navigateTo({
        url: `../education/education?url=${dialog.url}&type=0}`
      }) : this.toLive(dialog.extra.room_id)
      this.closeSignIn()
      wx.uma.trackEvent('index_activityClick');
    } else {
      wx.uma.trackEvent('index_bannerClick', {
        bannerTencent: this.data.paperMsg.title
      });
      wx.navigateTo({
        url: `../education/education?url=${e.currentTarget.dataset.peper}&type=0}`
      })
    }
  },
  toLive(id) {
    let customParams = encodeURIComponent(JSON.stringify({
      path: 'pages/index/index',
      uid: this.data.$state.userInfo.id,
      type: 'invite'
    }))
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${id}&custom_params=${customParams}`
    })
  },
  // 课程完成状态
  doneless(id) {
    this.data.recommend.forEach(item => {
      item.id == id ? item.is_finish = 1 : ''
    })
    this.data.catrecommend.forEach((item, index) => {
      item.forEach(i => {
        i.id == id ? i.is_finish = 1 : ''
      })
    })
    this.setData({
      recommend: this.data.recommend,
      catrecommend: this.data.catrecommend
    })
  },
  closesignBox() {
    this.setData({
      showSignbox: false
    });
  },
  showIntegral() {
    this.setData({
      showSignbox: false,
      integral: "+20 学分",
      integralContent: "签到成功",
      showintegral: true,
      isSign: false
    });
    setTimeout(() => {
      this.setData({
        showintegral: false
      });
    }, 2000);
  },
  sigin() {
    if (!this.data.$state.userIndex.has_mp_openid) {
      wx.navigateTo({
        url: '/pages/education/education?type=sign&url=https://authorization.jinlingkeji.cn/#/',
      })
      this.setData({
        isSign: true
      })
    } else {
      this.signIn()
    }
  },
  toLivelesson(e) {
    let item = e.currentTarget.dataset.item
    app.liveData.getLiveBySpecialColumnId({
      specialColumnId: item.columnId
    }).then(() => {
      wx.navigateTo({
        url: `/page/live/pages/vliveRoom/vliveRoom?roomId=${item.liveId}`,
      })
    })
  },
  addStudy(e) {
    app.liveData.addSubscribe({
      columnId: e.detail.columnId
    }).then(() => {
      this.data.interestList.forEach(i => {
        i.columnId == e.detail.columnId ? i.isEnroll = 1 : ''
      })
      this.data.sprogInterestList.forEach(e => {
        i.columnId == e.detail.columnId ? i.isEnroll = 1 : ''
      })
      this.setData({
        interestList: this.data.interestList,
        sprogInterestList: this.data.sprogInterestList
      })
    })
  },
  checknextTap(e) {
    app.checknextTap(e)
  }
})