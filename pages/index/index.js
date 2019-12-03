//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    nav: [{ id:1,name: "推荐", class: "#recommend1", unMove: true }],
    height: 0,
    isRefreshing: false,
    activity: "",
    currentTab: 0, 
    showReco:false,
    guideNum: 0,
    guidetxt: '下一步',
    showSign: false,
    guideNum: 1,
    shownow: true,
    shownowt: true
  },
  navHeightList: [],
  onLoad: async function(e) {
    setTimeout( res => {
      if (!this.data.$state.userInfo.mobile) {
        let pages = getCurrentPages()
        if (pages[0].route == 'pages/login/login') {
          return
        }
        pages[0].route == 'pages/sign/sign' ?  '' :  wx.redirectTo({ url: "/pages/sign/sign" })
      }
    }, 3000)
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
      catrecommend:[]
    })
    if (this.data.$state.userInfo.mobile) {
      await app.user.signed().then(res => {
        let sign = res.data && res.data.signed
        app.store.setState({
          signdays: res.data.sign_days
        })
        app.setSignIn({ status: sign, count: sign ? 1 : this.data.$state.signStatus.count }, true)
      })
      await app.user.share({}).then(res => {
        app.setShare(res)
      })
      this.init()
      this.data.$state.signStatus.status == 1 ? '' : this.setData({
        showIntegration: true
      })
      this.integrationTime()
    }
  },
  onReady: function() {
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
          guideNum: 1
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
    let cur = event.currentTarget.dataset.current, id = event.currentTarget.dataset.id
    if (this.data.currentTab !== cur) {
      this.setData({
        currentTab: cur
      })
    }
    // this.geteCatrcommend(id)
    if (this.data.currentTab == 0) {
      this.setData({
        navScrollLeft: 0
      })}
  },
  getFeatureCode(e) {
    console.log(e)
    console.log(e.detail.formId)
  },
  switchTab(event) {
    let cur = event.detail.current , that = this
    this.timer ? clearTimeout(this.timer) : ''
    this.timer = setTimeout(() => {
      that.setData({
        currentTab: cur
      })
    }, 500)
    
    if(cur != 0) {
      let id = this.data.nav[cur].id
      this.geteCatrcommend(id, cur)
    }
    setTimeout(() => {
      this.setHeight()
    }, 600)
  },
  lastswitchTab(event) {
    let arr = this.data.nav, num = 0
    arr.forEach((i,index) => {
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
        msg.data.forEach(function(item) {
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
    if (this.data.catrecommend[id]){
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
          if (currtab != this.data.currentTab) return
          this.setHeight()
        }, 500)
      }
    })
  },
  getCategory() {
    this.categoryParams = {}
    app.user.getLessonCategory().then(msg => {
      if (msg.code == 1) {
        let arr = this.data.nav.slice(0, 1)
        msg.data.user_lesson_category.forEach((i,index) => {
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
    app.tabBar('user')
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
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
    e.scrollTop - scrollTop > 0  ? this.setData({
      shownow: false
    }) : this.setData({
        shownow: true
    })
  },
  //继续播放
  historyTap: function(e) {
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.id}&name=${e.currentTarget.dataset.title}&play=true`
    })
    //用于数据统计
    app.aldstat.sendEvent("继续播放", { name: e.currentTarget.dataset.title })
  },
  closenow() {
    this.setData({
      shownowt: false
    })
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
  integrationTime(){
    let data = new Date();
    let time = data.getDate();
    let tomorowTime = wx.getStorageSync("closeInTime")
  },
  /* 签到 */
  closeSignIn() {
    app.setSignIn({ status: 0, count: 1 }, true)
    this.setData({
      showIntegration: false
    })
  },
  signIn(data) {
    let sign = data.currentTarget.dataset.id == 1
    app.setSignIn({ status: true, count: 1 }, true)
    if (sign) {
      app.user.sign().then(res => {
        if (res.code == 1) {
          /* 前往积分页面 */
          wx.navigateTo({ url: "/pages/score/score?type=index" })
          this.setData({
            showIntegration: false
          })
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
        console.log('签到成功')
        app.store.setState({
          signdays: res.data.sign_days
        })
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
    if(this.data.currentTab != 0) {
      let id = this.data.nav[this.data.currentTab].id
      let temp = this.data.catrecommend[id]
      this.categoryParams[id].page++
      console.log(this.categoryParams, 8953498758345843578)
      return app.classroom.lessons(this.categoryParams[id]).then(msg => {
        if (msg.code === 1) {
          msg.data.forEach(function (item) {
            item.thousand = app.util.tow(item.browse)
          })
          this.data.catrecommend[id] = temp.concat(msg.data)
          console.log(this.data.catrecommend[id])
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
  },
  /* 广告位值跳转 */ 
  bannerGo(e) {
    let item = e.currentTarget.dataset.item;
    if (item.jump_type == 1) {
      /* 外链 */
      wx.navigateTo({
        url: `../education/education?type=0&url=${item.clickurl}&login=${item.is_login}`
      })
    } else if (item.jump_type == 2) {
      /* 视频 */
      wx.navigateTo({
        url: `../detail/detail?id=${item.video_id}&name=${item.title}`
      })
    } else if (item.jump_type == 4) {
      this.minigo(item.clickurl)
    }else {
      /* 文章 */
      wx.navigateTo({
        url: "../pDetail/pDetail?id=" + 826
      })
    }
  },
  // 跳友方小程序
  minigo(url) {
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
    app.user.dialog().then(res => {
      if(res.code == 1) {
        res.data.url ? this.setData({
          dialog: res.data
        }) : this.setData({
            showSign: true
        })
      } else {
        this.setData({
          showSign: true
        })
      }
    })
  },
  jumpPeper(e) {
    if (e.currentTarget.dataset.type == 'dialog') {
      this.closeSignIn()
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
    } else if (this.data.guideNum == 2){
      this.setData({
        guideNum: 3,
        guidetxt: '我知道了'
      })
    } else {
      let param = {
        guide_name: 'index'
      }
      app.user.guideRecordAdd(param).then(res => {
        if(res.code == 1) {
          app.getGuide()
          this.setData({
            guideNum: 5
          })
        }
      })
    }
  }
})
