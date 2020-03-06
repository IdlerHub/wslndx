// pages/login/login.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse("button.open-type.getPhoneNumber"),
    mode: 1,
    authenable: false,
    check: false,
    btnName: "获取验证码",
    showintegral: false
  },
  pageName: '登陆页',
  params: { tel: "", authCode: "", telFormat: false, codeFormat: false, mode: 1, tempCode: null },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    if (option.phone) {
      this.setData({
        phone: option.phone
      })
      this.params.telFormat = app.util.isPoneAvailable(option.phone)
      this.params.tel = option.phone
      this.onShow(option.mode)
    }
    option.check ? this.setData({
      check: true
    }) : ''
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    setTimeout(wx.hideLoading, 500)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (mode) {
    mode ? this.setData({
      mode,
      btnName: '重新获取'
    }) : ''
  },
  loginType(e, type) {
    this.setData({
      mode: parseInt(e.currentTarget.dataset.type)
    })
  },
  /**
  * 生命周期函数--监听页面卸载
  */
  onUnload: function () {
    if (!this.data.$state.userInfo.mobile) {
      this.params.mode = this.data.mode
      wx.redirectTo({
        url: `/pages/login/login?phone=${this.params.tel}&mode=${this.params.mode}&tempCode=${this.params.tempCode}`
      })
    }
  },
  /* 授权获取电话号码 */
  getPhoneNumber: function (e) {
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      let param = {
        mobileEncryptedData: e.detail.encryptedData,
        mobileiv: e.detail.iv,
        tempCode: app.globalData.tempCode,
        [app.globalData.query.activity || app.globalData.shareObj.t == 4 ? 'master_uid' : 'invite_uid']: wx.getStorageSync("invite")
        // invite_uid: wx.getStorageSync("invite") /* 邀请码 */
      }
      this.login(param)
    } else {
      return
    }
  },
  /* 输入电话号码 */
  // inputTel(e) {

  // },
  inputNum(e) {
    this.params.telFormat = app.util.isPoneAvailable(e.detail.value)
    this.params.tel = e.detail.value
  },
  /* 输入验证码 */
  inputCode(e) {
    this.params.authCode = e.detail.value.replace(/^\s+|\s+$/g, '');
    this.params.codeFormat = !!this.params.authCode && this.params.authCode.toString().length == 6
  },
  /* 获取验证码 */
  getCode() {
    if (this.params.telFormat) {
      /* send  code */
      app.user.getAuthCode({ mobile: this.params.tel }).then(res => {
        this.setData({
          btnName: "重新获取",
        })
        this.countDown()
      }).catch(err => {
        wx.showToast({
          title: err.msg,
          icon: "none",
          duration: 1500,
          mask: false
        })
      })
    } else {
      wx.showToast({
        title: '手机格式不正确',
        icon: "none",
        duration: 1500,
        mask: false
      })
    }
  },
  /* 验证码计时器 */
  countDown() {
    this.setData({
      authenable: true,
      btnName: "60 s"
    })
    let num = 60
    let it = setInterval(() => {
      if (num > 1) {
        num -= 1
        this.setData({
          btnName: num + " s"
        })
      } else {
        this.setData({
          btnName: "重新获取",
          authenable: false
        })
        clearInterval(it)
      }
    }, 1000)
  },
  /* 手机号登录 */
  send() {
    // master_uid
    if (!this.params.telFormat || !this.params.codeFormat) {
      !this.params.telFormat ? wx.showToast({
        title: "电话号码格式不对",
        icon: "none",
        duration: 1500,
        mask: false
      }) : wx.showToast({
        title: "验证码格式不对",
        icon: "none",
        duration: 1500,
        mask: false
      })
    } else {
      let params = {
        tempCode: app.globalData.tempCode,
        mobile: this.params.tel,
        captcha: this.params.authCode,
        [app.globalData.query.activity || app.globalData.shareObj.t == 4 ? 'master_uid' : 'invite_uid']: wx.getStorageSync("invite")
        // invite_uid: wx.getStorageSync("invite") /* 邀请码 */
      }
      this.login(params)
    }
  },
  /* 登录请求 */
  login(param) {
    app.user.register(param).then(res => {
      /* 新用户注册不用提示签到 */
      app.setSignIn({ status: false, count: 1 })
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
        if (app.globalData.query.type == "share" || app.globalData.query.type == 'lottery') {
          let params = []
          for (let attr in app.globalData.query) {
            params.push(attr + "=" + app.globalData.query[attr])
          }
          setTimeout(() => {
            app.globalData.shareObj.type == 'lottery' ? wx.reLaunch({ url: "/pages/education/education?type=lottery&login=1&id=" + app.globalData.lotteryId }) : wx.reLaunch({ url: app.globalData.path + "?" + params.join("&") })
          }, 2000)
        } else if (app.globalData.shareObj.p || app.globalData.query.vote) {
          setTimeout(() => {
            wx.reLaunch({ url: "/pages/voteDetail/voteDetail?voteid=" + (app.globalData.shareObj.o ? app.globalData.shareObj.o : app.globalData.query.voteid) })
          }, 2000);
        } else {
          /*跳转首页*/
          setTimeout(() => {
            wx.reLaunch({ url: "/pages/index/index?type=login" })
          }, 2000)
        }
      }
    }).catch(err => {
      wx.showToast({
        title: err.msg,
        icon: "none",
        duration: 1500,
        mask: false
      })
    })
  },
  checkboxChange: function (e) {
    if (this.data.check) {
      this.setData({
        check: false
      })
    } else {
      this.setData({
        check: true
      })
    }
  },
  /* 去协议页面 */
  toAgree() {
    wx.navigateTo({
      url: '/pages/agreement/agreement',
    })
  }
})
