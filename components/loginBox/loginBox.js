// components/loginBox/loginBox.js
const app = getApp()
Component({
  properties: {

  },
  data: {
    check: true,
    phoneLogin: false
  },
  methods: {
    checkRadio() {
      this.setData({
        check: !this.data.check
      })
    },
    showToast() {
      wx.showToast({
        title: '请勾选已阅读用户协议',
        icon: 'none'
      })
    },
    getphonenumber(e) {
      console.log(wx.getStorageSync("invite"), '邀请人')
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        let param = {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          openid: app.globalData.loginDetail.openid,
          sessionKey: app.globalData.loginDetail.sessionKey,
          // [app.globalData.query.activity || app.globalData.shareObj.t == 4 ? 'master_uid' : 'invite_uid']: wx.getStorageSync("invite")
          [app.globalData.query.com ? 'source' : '']: app.globalData.query.com ? app.globalData.query.com : '',
          masterUid: wx.getStorageSync("invite") /* 邀请码 */
        }
        this.login(param)
        wx.uma.trackEvent('video_historyPlay', {
          signBtn: '授权'
        });
      } else {
        wx.showToast({
          title: '未授权成功,请重新授权',
          icon: 'none'
        })
      }
    },
    changeLoginstatus() {
      getApp().changeLoginstatus()
    },
    nextTap() {
      let page = getCurrentPages()[getCurrentPages().length - 1]
      // page.route == 'pages/index/index' ? page.init() : ''
      switch (this.data.$state.nextTapDetial.type) {
        case 'top':
          page.toInfo()
          break;
        case 'searchBox':
          page.setData({
            focus: true
          })
          break;
        case 'search':
          wx.navigateTo({
            url: this.data.$state.nextTapDetial.detail,
          })
          break;
        case 'myLesson':
          wx.navigateTo({
            url: this.data.$state.nextTapDetial.detail,
          })
          break;
        case 'swiper':
          page.bannerGo(this.data.$state.nextTapDetial.detail)
          break;
        case 'live':
          page.toLivelesson(this.data.$state.nextTapDetial.detail)
          break;
        case 'lesson':
          page.selectComponent('#lessonItem').toLesson(this.data.$state.nextTapDetial.detail)
          break;
        case 'addStudy':
          page.selectComponent('#lessonItem').addStudy(this.data.$state.nextTapDetial.detail)
          break;
        case 'navBar':
          wx.switchTab({
            url: this.data.$state.nextTapDetial.detail,
          })
          break;
        case 'addSubscribe':
          page.rightNow()
          break;
        case 'attenBtn':
          page.toEducation(this.data.$state.nextTapDetial.detail)
          break;
      }
    },
    /* 登录请求 */
    login(param) {
      console.log(param, '登录信息')
      app.user.register(param).then(res => {
        /* 新用户注册不用提示签到 */
        // app.setSignIn({
        //   status: false,
        //   count: 1
        // })
        wx.setStorageSync("token", res.data.token)
        wx.setStorageSync("uid", res.data.uid)
        wx.setStorageSync("authKey", res.data.authKey)
        app.setUser(res.data.userInfo)
        app.setAuthKey(res.data.authKey)
        if (wx.getStorageSync("goosId")) {
          let params = {
            invite_uid: wx.getStorageSync("invite"),
            goods_id: wx.getStorageSync("goosId")
          }
          app.user.addLotteryInvite(params).then()
        } else if (app.globalData.shareObj.p || app.globalData.query.voteid) {
          let params = {
            invite_id: wx.getStorageSync("invite"),
            invite_type: app.globalData.shareObj.p ? app.globalData.shareObj.p : 2
          }
          app.vote.recordInvite(params)
        }
        if (res.data.userInfo.mobile) {
          this.setData({
            showintegral: true
          })
          app.globalData.tempCode = null
          app.globalData.loginDetail = {}
          app.store.setState({
            showLogin: false
          })
        }
        this.nextTap()
      }).catch(err => {
        if (err.msg == '您已经注册过') {
          wx.setStorageSync("token", err.data.token)
          wx.setStorageSync("uid", err.data.uid)
          wx.setStorageSync("authKey", err.data.authKey)
          app.setUser(err.data.userInfo)
          app.setAuthKey(err.data.authKey)
          app.globalData.tempCode = null
          app.globalData.loginDetail = {}
          app.store.setState({
            showLogin: false
          })
          this.nextTap()
        } else {
          wx.showToast({
            title: err.msg,
            icon: "none",
            duration: 1500,
            mask: false
          })
        }
      })
    },
  }
})