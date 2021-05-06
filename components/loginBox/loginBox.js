// components/loginBox/loginBox.js
const app = getApp();
Component({
  properties: {
    statusBarHeight: {
      type: Number,
      value: 80
    }
  },
  data: {
    check: true,
    phoneLogin: false,
    radio: '1',
    show: true
  },
  methods: {
    checkRadio() {
      this.setData({
        check: !this.data.check,
      });
    },
    showToast() {
      wx.showToast({
        title: "请勾选已阅读用户协议",
        icon: "none",
      });
    },
    getphonenumber(e) {
      console.log(wx.getStorageSync("invite"), "邀请人");
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        let param = {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          openid: app.globalData.loginDetail.openid,
          sessionKey: app.globalData.loginDetail.sessionKey,
          // [app.globalData.query.activity || app.globalData.shareObj.t == 4 ? 'master_uid' : 'invite_uid']: wx.getStorageSync("invite")
          [app.globalData.query.com ? "source" : ""]: app.globalData.query.com ?
            app.globalData.query.com : "",
          masterUid: wx.getStorageSync("invite") /* 邀请码 */ ,
        };
        this.login(param);
        wx.uma.trackEvent("video_historyPlay", {
          signBtn: "授权",
        });
      } else {
        wx.showToast({
          title: "未授权成功,请重新授权",
          icon: "none",
        });
      }
    },
    changeLoginstatus() {
      let page = getCurrentPages()[getCurrentPages().length - 1];
      getApp().changeLoginstatus();
      this.setData({
        show: true
      })
      page.videoContext ? [page.videoContext.play(), page.setData({
        playing: true
      })] : null
    },
    nextTap() {
      let page = getCurrentPages()[getCurrentPages().length - 1];
      switch (this.data.$state.nextTapDetial.type) {
        case "top":
          page.toInfo();
          break;
        case "searchItem":
          wx.navigateTo({
            url: "/page/index/pages/detail/detail?id=" +
              this.data.$state.nextTapDetial.detail.currentTarget.dataset.item
              .id,
          });
          break;
        case "search":
          wx.navigateTo({
            url: this.data.$state.nextTapDetial.detail,
          });
          page.pageName == '首页' ? page.unshare() : null
          break;
        case "myLesson":
          wx.navigateTo({
            url: this.data.$state.nextTapDetial.detail,
          });
          break;
        case "swiper":
          page.bannerGo(this.data.$state.nextTapDetial.detail);
          break;
        case "live":
          page.toLivelesson(this.data.$state.nextTapDetial.detail);
          break;
        case "lesson":
          page
            .selectComponent("#lessonItem")
            .toLesson(this.data.$state.nextTapDetial.detail);
          break;
        case "addStudy":
          page
            .selectComponent("#lessonItem")
            .addStudy(this.data.$state.nextTapDetial.detail);
          break;
        case "navBar":
          wx.switchTab({
            url: this.data.$state.nextTapDetial.detail,
          });
          break;
        case "addSubscribe":
          page.rightNow();
          break;
        case "attenBtn":
          page.toEducation(this.data.$state.nextTapDetial.detail);
          break;
        case "education":
          let params = JSON.parse(this.data.$state.nextTapDetial.detail);
          setTimeout(() => {
            wx.navigateTo({
              url: `/pages/education/education?type=0&login=${
                params.login || 0
              }&url=${params.url}`,
            });
          }, 1000);
          break;
        case "nameFunction":
          if (page.selectComponent('#videoSwiper')) {
            page.selectComponent('#videoSwiper')[this.data.$state.nextTapDetial.funname]()
          } else if (this.data.$state.nextTapDetial.funname == 'showBox' || this.data.$state.nextTapDetial.funname == 'showGift') {
            page.selectComponent('#liveBottom')[this.data.$state.nextTapDetial.funname]()
          } else if (this.data.$state.nextTapDetial.funname == 'addStudy') {
            page[this.data.$state.nextTapDetial.funname](this.data.$state.nextTapDetial.detail.currentTarget.dataset.item)
          } else {
            this.data.$state.nextTapDetial.funname ? page[this.data.$state.nextTapDetial.funname](this.data.$state.nextTapDetial.detail) : wx.showToast({
              title: '登录成功，请预约上课',
              icon: 'none'
            })
          }
          if (page.pageName == 'live') {
            page.liveInit(1)
          }
          break;
      }
    },
    /* 登录请求 */
    login(param) {
      let that = this
      app.user
        .register(param)
        .then(async function (res) {
          /* 新用户注册不用提示签到 */
          // app.setSignIn({
          //   status: false,
          //   count: 1
          // })
          await wx.setStorageSync("token", res.data.token);
          await wx.setStorageSync("uid", res.data.uid);
          await wx.setStorageSync("authKey", res.data.authKey);
          await app.setUser(res.data.userInfo);
          await app.setAuthKey(res.data.authKey);
          if (wx.getStorageSync("goosId")) {
            let params = {
              invite_uid: wx.getStorageSync("invite"),
              goods_id: wx.getStorageSync("goosId"),
            };
            app.user.addLotteryInvite(params).then();
          } else if (app.globalData.shareObj.p || app.globalData.query.voteid) {
            let params = {
              invite_id: wx.getStorageSync("invite"),
              invite_type: app.globalData.shareObj.p ?
                app.globalData.shareObj.p : 2,
            };
            app.vote.recordInvite(params);
          }
          if (res.data.userInfo.mobile) {
            that.setData({
              show: false
            })
            app.globalData.tempCode = null;
            app.globalData.loginDetail = {};
          }
          await that.setIntegral(that, '+ 100学分', '注册完成');
        })
        .catch((err) => {
          if (err.msg == "您已经注册过") {
            wx.setStorageSync("token", err.data.token);
            wx.setStorageSync("uid", err.data.uid);
            wx.setStorageSync("authKey", err.data.authKey);
            app.setUser(err.data.userInfo);
            app.setAuthKey(err.data.authKey);
            app.globalData.tempCode = null;
            app.globalData.loginDetail = {};
            app.store.setState({
              showLogin: false,
            });
            this.nextTap();
          } else {
            wx.showToast({
              title: err.msg,
              icon: "none",
              duration: 1500,
              mask: false,
            });
          }
        });
    },
    onChange(event) {
      this.setData({
        radio: this.data.radio == 1 ? '2' : '1',
      });
    },
    /* 积分动画 */
    setIntegral(that, integral, integralContent) {
      that.setData({
        integral,
        integralContent,
        showintegral: true,
      });
      setTimeout(() => {
        that.setData({
          showintegral: false,
        });
        app.store.setState({
          showLogin: false,
        });
        that.nextTap();
      }, 2000);
    },
  },
});