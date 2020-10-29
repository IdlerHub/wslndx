//index.js

const Tutor = require("../../data/Tutor")

//获取应用实例
const app = getApp()
Page({
  data: {
    nav: [{
      id: 1,
      name: "推荐",
      class: "#recommend1",
      unMove: true
    }],
    height: 1000,
    isRefreshing: false,
    currentTab: 0,
    showReco: false,
    guideNum: 0,
    guidetxt: '下一步',
    guideNum: 1,
    shownow: true,
    shownowt: true,
    showdialog: true,
    showSignbox: true
  },
  navHeightList: [],
  pageName: '首页',
  guide: 0,
  liveTimer: '',
  onLoad: async function (e) {
    !getApp().globalData.tempCode ? '' : wx.reLaunch({
      url: "/pages/sign/sign"
    });
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
    query.select(".nav").boundingClientRect()
    query.exec(res => {
      that.headerHeight = res[0].height + pt + h
      that.navHeight = res[1].height
      that.navWidth = res[1].width
    })
    this.setData({
      recommend: [],
      liveRecommend: [],
      category: [],
      history: {},
      navScrollLeft: 0,
      catrecommend: []
    })
    if (this.data.$state.userInfo.mobile) {
      await app.user.signed().then(res => {
        let sign = res.data && res.data.signed
        app.store.setState({
          signdays: res.data.sign_days
        })
        app.setSignIn({
          status: sign,
          count: sign ? 1 : this.data.$state.signStatus.count
        }, true)
      })
      await app.user.share({}).then(res => {
        app.setShare(res)
      })
      this.init()
      this.integrationTime()
    }
  },
  onReady: function () {},
  onShow() {
    app.globalData.currentTab == 1 ? this.setData({
      currentTab: 1
    }) : ''
    app.globalData.currentTab = ''
    /* 更新用户的视频浏览历史 */
    if (app.store.$state.userInfo.mobile)[this.getHistory(), app.getUserOpenData()]
    setTimeout(wx.hideLoading, 500)
    this.setData({
      showSignbox: true
    })
    this.data.isSign ? this.signIn() : ''
  },
  init() {
    return Promise.all([this.getactivite(), this.getRecommendLessons(1), this.getRecommend(), this.getCategory(), this.getBanner(), this.getPaper(), this.getDialog(), this.getGuide(), this.getUserOpenid()]).then(values => {
      if (this.data.$state.newGuide.index == 0) {
        this.setData({
          guideNum: 1,
          showdialog: false
        })
        app.setSignIn({
          status: false,
          count: 1
        }, true)
      } else {
        this.setData({
          guideNum: 5
        })
      }
      console.log(app.globalData.query)
      if (app.globalData.query.categoryId) {
        this.data.nav.forEach((v, i) => {
          v.id == app.globalData.query.categoryId ? this.setData({
            currentTab: i
          }) : ''
        })
      }
      this.navHeightList = []
      this.setHeight()
    })
  },
  // 获取新手指引
  getGuide() {
    return app.user.guideRecord().then(res => {
      let newGuide = res.data
      app.store.setState({
        newGuide
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
  setHeight() {
    let nav = this.data.nav
    let currentTab = this.data.currentTab
    if (this.navHeightList[currentTab]) {
      this.navHeightList[currentTab] < 300 ? this.getheight(nav, currentTab) : this.setData({
        height: this.navHeightList[currentTab]
      })
    } else {
      this.getheight(nav, currentTab)
    }
  },
  getheight(nav, currentTab) {
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
  },
  switchNav(event) {
    let cur = event.currentTarget.dataset.current,
      id = event.currentTarget.dataset.id
    if (this.data.currentTab != cur) {
      this.setData({
        currentTab: cur
      })
    }
    if (this.data.currentTab == 0) {
      this.setData({
        navScrollLeft: 0
      })
    }
  },
  centerTab(e) {
    this.setData({
      bannercurrentTab: e.detail.current
    })
  },
  switchTab(event) {
    let cur = event.detail.current,
      that = this,
      currren = this.data.currentTab
    this.timer ? clearTimeout(this.timer) : ''
    this.timer = setTimeout(() => {
      this.data.currentTab != cur ? cur == that.setData({
        currentTab: cur,
      }) : ''
      wx.hideLoading()
    }, 300)
    if (cur != 0) {
      let id = this.data.nav[cur].id
      this.geteCatrcommend(id, cur)
      wx.uma.trackEvent('classify_btnClick', {
        name: this.data.nav[cur].name
      });
    }
    setTimeout(() => {
      this.setHeight()
    }, 500)
  },
  lastswitchTab(event) {
    if (!event) {
      this.setData({
        currentTab: 0
      })
    } else {
      let arr = this.data.nav,
        num = 0
      arr.forEach((i, index) => {
        i.id == event ? num = index : 0
      })
      this.setData({
        currentTab: num
      })
      if (this.data.catrecommend[event]) {
        if (!this.data.catrecommend[event][0]) this.geteCatrcommend(event, this.data.currentTab)
      } else {
        this.geteCatrcommend(event, this.data.currentTab)
      }
    }
  },
  getRecommend() {
    let param = {
      page: 1,
      pageSize: 10,
      province: this.data.$state.userInfo.university.split(',')[0]
    }
    return app.classroom.recommend(param).then(msg => {
      msg.data.forEach(function (item) {
        item.bw = app.util.tow(item.browse)
      })
      this.setData({
        recommend: msg.data
      })
      wx.hideLoading()
    })
  },
  getRecommendLessons(type) {
    if (this.data.liveRecommend[0] && !type) {
      setInterval(() => {
        app.liveData.recommendLessons().then(res => {
          this.setData({
            liveRecommend: res.data
          })
        })
      }, 60000);
    } else {
      app.liveData.recommendLessons().then(res => {
        this.setData({
          liveRecommend: res.data
        }, () => {
          res.data.length > 0 ? this.getRecommendLessons() : ''
        })
      })
    }

  },
  geteCatrcommend(id, currtab) {
    if (this.data.catrecommend[id]) {
      if (this.data.catrecommend[id][0]) return
    }
    let temp = []
    return app.classroom.lessons(this.categoryParams[id]).then(msg => {
      msg.data.forEach(function (item) {
        item.thousand = app.util.tow(item.browse)
      })
      let catrecommend = this.data.catrecommend
      catrecommend[id] = temp.concat(msg.data)
      this.setData({
        [`catrecommend[${id}]`]: temp.concat(msg.data)
      })
      temp.concat(msg.data).length < 10 ? this.setData({
        [`nav[${this.data.currentTab}].showBtoom`]: true
      }) : ''
      setTimeout(() => {
        currtab != this.data.currentTab ? '' : this.setHeight()
      }, 600)
    })
  },
  getCategory() {
    this.setData({
      currentTab: 0,
    })
    this.categoryParams = {}
    return app.user.getLessonCategory().then(msg => {
      let arr = this.data.nav.slice(0, 1)
      msg.data.user_lesson_category.forEach((i, index) => {
        this.categoryParams[i.id] = {
          category_id: i.id,
          page: 1,
          pageSize: 10
        }
        i['class'] = '#recommend' + i.id
        i['showBtoom'] = false
        arr.push(i)
      })
      this.setData({
        nav: arr
      })
    })
  },
  getactivite() {
    // return app.user.activite()
  },
  getBanner() {
    this.setData({
      bannercurrentTab: 0
    })
    return app.classroom.banner({}).then(res => {
      this.setData({
        imgUrls: res.data
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
  //点击推荐课堂
  detailTap: function (e) {
    wx.navigateTo({
      url: `../../page/index/pages/detail/detail?id=${e.currentTarget.dataset.item.id}&name=${e.currentTarget.dataset.item.title}`
    })
    //用于数据统计
    if (e.currentTarget.dataset.type) {
      wx.uma.trackEvent('classify_lessonsClick', {
        ['classifyID_' + this.data.nav[this.data.currentTab].id]: e.currentTarget.dataset.item.title
      });
    } else {
      wx.uma.trackEvent('index_recommendLessons', {
        lessonsName: e.currentTarget.dataset.item.title
      });
    }
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
  integrationTime() {
    let data = new Date();
    let time = data.getDate();
    let tomorowTime = wx.getStorageSync("closeInTime")
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
    if (this.data.currentTab != 0 && !this.data.nav[this.data.currentTab].showBtoom) {
      let id = this.data.nav[this.data.currentTab].id
      let temp = this.data.catrecommend[id]
      this.categoryParams[id].page++
      wx.showLoading({
        title: '加载中'
      })
      app.classroom.lessons(this.categoryParams[id]).then(msg => {
        let next = true
        msg.data.forEach(function (item) {
          item.thousand = app.util.tow(item.browse)
          temp.forEach(i => {
            i.id == item.id ? next = false : ''
          })
        })
        if (!next) return
        if (msg.data.length == 0) {
          this.setData({
            [`nav[${this.data.currentTab}].showBtoom`]: true
          })
        }
        this.data.catrecommend[id] = temp.concat(msg.data)
        this.setData({
          [`catrecommend[${id}]`]: temp.concat(msg.data)
        })
        let query = wx.createSelectorQuery().in(this)
        let that = this,
          nav = this.data.nav,
          currentTab = this.data.currentTab
        query.select(nav[currentTab].class).boundingClientRect()
        query.exec(res => {
          let height = res[0].height
          that.navHeightList[currentTab] = height
          that.setData({
            height: height,
            showLoading: false
          })
          wx.hideLoading()
        })
      })
    }
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
    if (item.jump_type == 1) {
      /* 外链 */
      wx.navigateTo({
        url: `../education/education?type=0&url=${item.clickurl}&login=${item.is_login}`
      })
      wx.uma.trackEvent('index_bannerClick', {
        bannerTencent: item.title
      });
    } else if (item.jump_type == 2) {
      /* 视频 */
      wx.navigateTo({
        url: `../../page/index/pages/detail/detail?id=${item.video_id}&name=${item.title}`
      })
      wx.uma.trackEvent('index_bannerClick', {
        bannerVideo: item.title
      });
    } else if (item.jump_type == 4) {
      this.minigo(item.clickurl)
      wx.uma.trackEvent('index_bannerClick', {
        bannerMini: item.title
      });
    } else if (item.jump_type == 5) {
      wx.navigateTo({
        url: item.clickurl,
      })
      wx.uma.trackEvent('index_bannerClick', {
        bannerActivity: item.title
      });
    } else if (item.jump_type == 6) {
      this.toLive(item.clickurl)
    } else {
      /* 文章 */
      wx.navigateTo({
        url: "../../page/post/pages/pDetail/pDetail?id=" + item.article_id
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
  getPaper() {
    app.classroom.paper({}).then(res => {
      this.setData({
        paperMsg: res.data
      })
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
  /* 指引联动 */
  nextGuide() {
    if (this.data.guideNum == 1) {
      this.setData({
        guideNum: 2
      })
    } else if (this.data.guideNum == 2) {
      this.setData({
        guideNum: 3,
        guidetxt: '我知道了'
      })
    } else {
      if (this.guide) return
      this.guide = true
      let param = {
        guide_name: 'index'
      }
      app.user.guideRecordAdd(param).then(res => {
        app.getGuide()
        this.setData({
          guideNum: 5
        })
      }).catch(() => {
        this.guide = 0
        err.msg == '记录已增加' ? app.setState({
          'newGuide.index': 1
        }) : ''
      })
    }
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
    console.log(4324234)
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
    wx.navigateTo({
      url: "/page/live/pages/liveDetail/liveDetail?lessonId=" +
        item.id
    });
  }
})