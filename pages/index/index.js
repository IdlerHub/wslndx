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
    centerIcon: [],
    times: 0, // 打开弹窗次数 默认0
    showNewStudentBox: false
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
      // that.headerHeight = res[0].height + pt + h
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
    this.setCenterIcon()
    // 展示新生弹窗
    let date = wx.getStorageSync('date') || ''; // 之前记录的日期
    let newDate = app.util.formatDate(); // 获取当前日期
    date != newDate ? this.setData({ times: 0 }): this.setData({times: 1}) // 如之前记录日期和当前日期不等 times恢复为0
  },
  setCenterIcon() {
    this.setData({
      centerIcon: [{
        url: '/page/index/pages/allLesson/allLesson',
        icon: `${this.data.$state.imgHost}/indexIcon/allLessonIcon.png`,
        name: '全部课程',
        width: 92,
        height: 92
      }, {
        url: '/page/index/pages/topTeacher/topTeacher',
        icon: `${this.data.$state.imgHost}/indexIcon/topTeacher.png`,
        name: '名师榜',
        width: 92,
        height: 92
      }, {
        url: '/page/index/pages/schoolLesson/schoolLesson',
        icon: `${this.data.$state.imgHost}/indexIcon/shollLesson.png`,
        name: '高校课程',
        width: 92,
        height: 92
      }, {
        url: '/page/index/pages/hotActivity/hotActivity',
        icon: `${this.data.$state.imgHost}/indexIcon/hotActivityIcon.png`,
        name: '热门活动',
        width: 92,
        height: 92
      },
      // {
      //   url: '/page/index/pages/lessonSpecial/lessonSpecial?id=3&name=智能技术',
      //   icon: `${this.data.$state.imgHost}/indexIcon/technologyIcon.png`,
      //   name: '智能技术',
      //   width: 64,
      //   height: 64,
      // },
       {
        url: '/page/index/pages/charityLesson/charityLesson',
        icon: '../../images/charityLesson.png',
        name: '本月公益课',
        width: 64,
        height: 64,
      }, {
        url: '/pages/video/video',
        icon: `${this.data.$state.imgHost}/indexIcon/sortVideoicon1.png`,
        name: '短视频',
        width: 64,
        height: 62.49,
      }, {
        url: 'pages/studyCard/studyCard?type=home',
        icon: `${this.data.$state.imgHost}/indexIcon/vipIcon.png`,
        name: 'VIP专区',
        width: 59,
        height: 66,
        toMiniProgram: 'wx8dc9e7f55fe1f3ff'
      }, {
        url: '/page/index/pages/rankingList/rankingList',
        icon: `${this.data.$state.imgHost}/indexIcon/dowloadIcon.png`,
        name: '下载APP',
        width: 86,
        height: 76,
        toEducation: 'https://mp.weixin.qq.com/s/vSd8XBQDQkvqVX_kt_YyTQ',
        showCanvas: 1
      },]
    })
  },
  init(type) {
    if(type) {
      return Promise.all([this.getRecommendLessons(1), this.getBanner(), this.getDialog(), this.getUserOpenid()]).then(() => {
        this.getSigns()
      })
    } else if (this.data.$state.userInfo.mobile) {
      return Promise.all([this.getRecommendLessons(1), this.getinterestList(), this.getBanner(), this.getDialog(), this.getUserOpenid()]).then(() => {
        this.getSigns()
      })
    } else {
      return Promise.all([this.getRecommendLessons(1), this.getinterestList(), this.getBanner()])
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
            liveRecommend: res.dataList
          })
        })
      }, 60000);
    } else {
      app.liveData.recommendLessons().then(res => {
        this.setData({
          liveRecommend: res.dataList
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
      pageNum: 1,
      pageSize: 1
    }
    return app.study.centerSpecial(historyParam).then(msg => {
      this.setData({
        "history": msg.dataList[0] || "",
        showNewStudentBox: msg.dataList[0] ? false: true
      })
    })
  },
  router2newstudent() { // 跳新生体验馆，只弹一次，存当日日期
    let date = app.util.formatDate();
    wx.setStorageSync("date", date);
    this.setData({ times: 1})
    wx.navigateTo({
      url: "../../page/discoveryHall/pages/index/index"
    })
  },
  getSigns() {
    app.user.signed().then(res => {
      let sign = res.data && res.data.signed
      app.store.setState({
        signdays: res.data.sign_days
      })
      console.log(this.data.$state.signStatus.count)
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
      url: `/page/live/pages/liveDetail/liveDetail?specialColumnId=${e.currentTarget.dataset.id}&name=${e.currentTarget.dataset.title}&play=true`
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
      this.init()
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
        url: `../education/education?type=0&url=${item.clickurl}&login=${item.isLogin}`
      })
      wx.uma.trackEvent('index_bannerClick', {
        bannerTencent: item.title
      });
    } else if (item.jumpType == 2) {
      /* 视频 */
      wx.navigateTo({
        url: `../../page/index/pages/detail/detail?id=${item.videoId}&name=${item.title}`
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
      if(dialog.jump_type == 1) {
        wx.navigateTo({
          url: `../education/education?url=${dialog.url}&type=activity&login=1}`
        })
      } else if(dialog.jump_type == 2) {
        this.toLive(dialog.extra.room_id)
      } else if(dialog.jump_type == 3){
        this.minigo(dialog.url)
      } else {
        this.toLivelesson()
      }
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
    wx.navigateTo({
      url: `/page/live/pages/vliveRoom/vliveRoom?roomId=${id}`
    })
  },
  closesignBox() {
    this.setData({
      showSignbox: false
    });
    app.setSignIn({
      status: 0,
      count: 1
    }, true)
  },
  /* 积分动画 */
  showIntegral() {
    app.setIntegral(this, "+2 学分", "签到成功", 'type')
    this.setData({
      showSignbox: false,
      isSign: false
    });
  },
  sigin() {
    if (!this.data.$state.userIndex.has_mp_openid) {
      wx.navigateTo({
        url: '/pages/education/education?type=sign&url=https://globalh5pro.jinlingkeji.cn/Authorization/#/',
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
    }).then(res => {
      if(this.data.$state.userInfo.id && item.status != 2) {
        wx.navigateTo({
          url: `/page/live/pages/vliveRoom/vliveRoom?roomId=${item.liveId}`,
        })
      } else if (!res.data.isAddSubscribe || !this.data.$state.userInfo.id) {
        wx.navigateTo({
          url: `/page/live/pages/tableDetail/tableDetail?specialColumnId=${item.columnId}`,
        })
      } else if(item.status == 2) {
        wx.navigateTo({
          url: `/page/live/pages/liveDetail/liveDetail?specialColumnId=${item.columnId}`,
        })
      }
    })
  },
  addStudy(e) {
    app.liveData.addSubscribe({
      columnId: e.detail.columnId
    }).then(() => {
      this.data.interestList.forEach(i => {
        i.columnId == e.detail.columnId ? i.isEnroll = 1 : ''
      })
      this.data.sprogInterestList.forEach(i => {
       i.columnId == e.detail.columnId ? i.isEnroll = 1 : ''
      })
      wx.showToast({
        title: '报名成功',
        icon: 'none'
      })
      this.setData({
        interestList: this.data.interestList,
        sprogInterestList: this.data.sprogInterestList
      })
    })
  },
  iconBind(e) {
    let item = e.currentTarget.dataset.item
    if(item.toEducation) {
      wx.navigateTo({
        url: '/pages/education/education?type=0&login=1&url=' + item.toEducation,
      })
    } else if(item.toMiniProgram) {
      this.minigo(`{"appid":"${item.toMiniProgram}","url":"${item.url}"}`)
    } else {
      wx.navigateTo({
        url: item.url
      })
    }
  },
  checknextTap(e) {
    app.checknextTap(e)
  }
})