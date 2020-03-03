//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    nav: [{ id: 1, name: "推荐", class: "#recommend1", unMove: true }],
    height: 0,
    isRefreshing: false,
    activity: "",
    currentTab: 0,
    showReco: false,
    guideNum: 0,
    guidetxt: '下一步',
    guideNum: 1,
    shownow: true,
    shownowt: true,
    showdialog: true
  },
  navHeightList: [],
  pageName: '首页',
  onLoad: async function (e) {
    e.type != undefined ? this.pageType = e.type : ''
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
      that.headerHeight = res[0].height + pt + h
      that.navHeight = res[1].height
      that.navWidth = res[1].width
    })
    this.setData({
      recommend: [],
      category: [],
      history: {},
      navScrollLeft: 0,
      catrecommend: []
    })
    if (this.data.$state.userInfo.mobile) {
      await app.user.signed().then(res => {
        if(res.code == 1) {
          let sign = res.data && res.data.signed
          app.store.setState({
            signdays: res.data.sign_days
          })
          app.setSignIn({ status: sign, count: sign ? 1 : this.data.$state.signStatus.count }, true)
        }
      })
      await app.user.share({}).then(res => {
        if(res.code == 1) {
          app.setShare(res)
        }
      })
      this.init()
      this.integrationTime()
    }
  },
  onReady: function () {
  },
  onShow() {
    app.globalData.currentTab == 1 ? this.setData({
      currentTab: 1
    }) : ''
    app.globalData.currentTab = ''
    /* 更新用户的视频浏览历史 */
    if (app.store.$state.userInfo.mobile) this.getHistory()

    setTimeout(wx.hideLoading, 500)
  },
  init() {
    return Promise.all([this.getactivite(), this.getRecommend(), this.getCategory(), this.getBanner(), this.getPaper(), this.getDialog(), this.getGuide()]).then(values => {
      // this.setData({
      //   activity: values[0].data
      // })
      if (this.data.$state.newGuide.index == 0) {
        this.setData({
          guideNum: 1,
          showdialog: false
        })
        app.setSignIn({ status: false, count: 1 }, true)
      } else {
        this.setData({
          guideNum: 5
        })
      }
      this.navHeightList = []
      this.setHeight()
    })
  },
  // 获取新手指引
  getGuide() {
    return app.user.guideRecord().then(res => {
      if (res.code == 1) {
        let newGuide = res.data
        app.store.setState({
          newGuide
        })
      }
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
    let cur = event.currentTarget.dataset.current, id = event.currentTarget.dataset.id
    if (this.data.currentTab != cur) {
      this.setData({
        currentTab: cur
      })
    }
    console.log(cur)
    // this.geteCatrcommend(id)
    if (this.data.currentTab == 0) {
      this.setData({
        navScrollLeft: 0
      })
    }
  },
  getFeatureCode(e) {
    console.log(e)
    console.log(e.detail.formId)
  },
  switchTab(event) {
    let cur = event.detail.current, that = this, currren = this.data.currentTab
    this.timer ? clearTimeout(this.timer) : ''
    this.timer = setTimeout(() => {
      this.data.currentTab != cur ? cur == that.setData({
        currentTab: cur
      }) : ''
    }, 300)

    if (cur != 0) {
      let id = this.data.nav[cur].id
      this.geteCatrcommend(id, cur)
      wx.uma.trackEvent('classify_btnClick', { 'name': this.data.nav[cur].name });
    }
    setTimeout(() => {
      this.setHeight()
    }, 500)
  },
  lastswitchTab(event) {
    let arr = this.data.nav, num = 0
    arr.forEach((i, index) => {
      i.id == event ? num = index : ''
    })
    this.setData({
      currentTab: num
    })
    if (this.data.catrecommend[event]) {
      if (!this.data.catrecommend[event][0]) this.geteCatrcommend(event, this.data.currentTab)
    } else {
      this.geteCatrcommend(event, this.data.currentTab)
    }
  },
  getSomthin() {
    console.log('q')
  },
  getRecommend() {
    let param = { page: 1, pageSize: 10, province: this.data.$state.userInfo.university.split(',')[0] }
    return app.classroom.recommend(param).then(msg => {
      if (msg.code == 1) {
        msg.data.forEach(function (item) {
          item.bw = app.util.tow(item.browse)
        })
        this.setData({
          recommend: msg.data
        })
        wx.hideLoading()
      }
    })
  },
  geteCatrcommend(id, currtab) {
    if (this.data.catrecommend[id]) {
      if (this.data.catrecommend[id][0]) return
    }
    let temp = []
    return app.classroom.lessons(this.categoryParams[id]).then(msg => {
      if (msg.code === 1) {
        msg.data.forEach(function (item) {
          item.thousand = app.util.tow(item.browse)
        })
        let catrecommend = this.data.catrecommend
        catrecommend[id] = temp.concat(msg.data)
        this.setData({
          catrecommend
        })
        setTimeout(() => {
          currtab != this.data.currentTab ? '' : this.setHeight()
        }, 600)
      }
    })
  },
  getCategory() {
    this.categoryParams = {}
    app.user.getLessonCategory().then(msg => {
      if (msg.code == 1) {
        let arr = this.data.nav.slice(0, 1)
        msg.data.user_lesson_category.forEach((i, index) => {
          this.categoryParams[i.id] = {
            category_id: i.id,
            page: 1,
            pageSize: 10
          }
          i['class'] = '#recommend' + i.id
          arr.push(i)
        })
        this.setData({
          nav: arr
        })
      }
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
    wx.switchTab({
      url: "../user/user"
    })
  },
  toInfo() {
    wx.navigateTo({
      url: "../info/info"
    })
  },
  toScore() {
    wx.navigateTo({
      url: "/pages/score/score?type=index"
    })
    wx.uma.trackEvent('index_btnClick', { 'btnName': '学分兑换' });
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
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
    e.scrollTop - scrollTop > 0 ? this.setData({
      shownow: false
    }) : this.shownow && this.setData({
      shownow: true
    })
  },
  //继续播放
  historyTap: function (e) {
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.id}&name=${e.currentTarget.dataset.title}&play=true`
    })
    wx.uma.trackEvent('video_historyPlay', { 'lessonsName': e.currentTarget.dataset.title });
  },
  closenow() {
    this.setData({
      shownowt: false
    })
  },
  //点击推荐课堂
  detailTap: function (e) {
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.item.id}&name=${e.currentTarget.dataset.item.title}`
    })
    //用于数据统计
    if (e.currentTarget.dataset.type) {
      wx.uma.trackEvent('classify_lessonsClick', { ['classifyID_' + this.data.nav[this.data.currentTab].id]: e.currentTarget.dataset.item.title });
    } else {
      wx.uma.trackEvent('index_recommendLessons', { 'lessonsName': e.currentTarget.dataset.item.title });
    }
  },
  //用于数据统计
  onHide() {
  },
  // 用户昵称等信息授权
  onGotUserInfo(e) {
    if (e.detail.errMsg === "getUserInfo:ok") {
      app.updateBase(e)
      if (e.currentTarget.dataset.role == "user") {
        this.toUser()
      } else if (e.currentTarget.dataset.role == "post") {
        this.toPost()
      } else if (e.currentTarget.dataset.type == "score") {
        this.toScore()
      } else if (e.currentTarget.dataset.type == "banner") {
        let item = e.currentTarget.dataset.item;
        console.log(item)
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
        wx.uma.trackEvent('index_bannerClick', { 'bannerTencent': item.title });
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
    app.setSignIn({ status: 0, count: 1 }, true)
    this.setData({
      showdialog: false
    })
  },
  signIn(data) {
    let sign = data.currentTarget.dataset.id == 1
    app.setSignIn({ status: true, count: 1 }, true)
    if (sign) {
      app.user.sign().then(res => {
        if (res.code == 1) {
          /* 前往学分页面 */
          wx.navigateTo({ url: "/pages/score/score?type=index" })
          app.store.setState({
            signdays: res.data.sign_days
          })
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
    } else {
      app.user.sign().then(res => {
        if(res.code == 1) {
          console.log('签到成功')
          app.store.setState({
            signdays: res.data.sign_days
          })
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
  onReachBottom() {
    if (this.data.currentTab != 0) {
      let id = this.data.nav[this.data.currentTab].id
      let temp = this.data.catrecommend[id]
      this.categoryParams[id].page++
      return app.classroom.lessons(this.categoryParams[id]).then(msg => {
        if (msg.code === 1) {
          let next = true
          msg.data.forEach(function (item) {
            item.thousand = app.util.tow(item.browse)
            temp.forEach(i => {
              i.id == item.id ? next = false : ''
            })
          })
          if (!next) return
          this.data.catrecommend[id] = temp.concat(msg.data)
          this.setData({
            catrecommend: this.data.catrecommend
          })
          let query = wx.createSelectorQuery().in(this)
          let that = this, nav = this.data.nav, currentTab = this.data.currentTab
          query.select(nav[currentTab].class).boundingClientRect()
          query.exec(res => {
            let height = res[0].height
            that.navHeightList[currentTab] = height
            that.setData({
              height: height
            })
          })
        }
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
      wx.uma.trackEvent('index_bannerClick', { 'bannerTencent': item.title });
    } else if (item.jump_type == 2) {
      /* 视频 */
      wx.navigateTo({
        url: `../detail/detail?id=${item.video_id}&name=${item.title}`
      })
      wx.uma.trackEvent('index_bannerClick', { 'bannerVideo': item.title });
    } else if (item.jump_type == 4) {
      this.minigo(item.clickurl)
      wx.uma.trackEvent('index_bannerClick', { 'bannerMini': item.title });
    } else if (item.jump_type == 5) {
      wx.navigateTo({
        url: item.clickurl,
      })
      wx.uma.trackEvent('index_bannerClick', { 'bannerActivity': item.title });
    } else {
      /* 文章 */
      wx.navigateTo({
        url: "../pDetail/pDetail?id=" + item.article_id
      })
      wx.uma.trackEvent('index_bannerClick', { 'bannerBlog': item.title });
    }
  },
  // 跳友方小程序
  jumpmini() {
    this.minigo('{"appid":"wx92d650b253f8f2e3","url":"/pages/index/index?zbid=1826546606"}')
    wx.uma.trackEvent('index_btnClick', { 'btnName': '课程直播' });
  },
  minigo(url) {
    console.log(url)
    let system = JSON.parse(url)
    wx.navigateToMiniProgram({
      appId: system.appid,
      path: system.url,
      // envVersion: 'develop',
      success() {
        // 打开成功
      },
      fail() {

      }
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
      if (res.code == 1) {
        res.data[0] ?
          this.setData({
            dialog: res.data,
            showdialog: true
          }) : 0
      }
    })
  },
  jumpPeper(e) {
    if (e.currentTarget.dataset.type == 'dialog') {
      this.closeSignIn()
      wx.uma.trackEvent('index_activityClick');
    } else {
      wx.uma.trackEvent('index_bannerClick', { 'bannerTencent': this.data.paperMsg.title });
    }
    wx.navigateTo({
      url: `../education/education?url=${e.currentTarget.dataset.peper}&type=0}`
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
      let param = {
        guide_name: 'index'
      }
      app.user.guideRecordAdd(param).then(res => {
        if (res.code == 1) {
          app.getGuide()
          this.setData({
            guideNum: 5
          })
        }
      })
    }
  },
  // 课程完成状态
  doneless(id) {
    this.data.recommend.forEach(item => {
      item.id == id ? item.is_finish = 1 : ''
    })
    this.data.catrecommend.forEach(item => {
      item.forEach(i => {
        i.id == id ? i.is_finish = 1 : ''
      })
    })
    this.setData({
      recommend: this.data.recommend,
      catrecommend: this.data.catrecommend
    })
  }
})
