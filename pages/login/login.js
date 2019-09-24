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
    check:false,
    btnName: "获取验证码"
  },
  params: { tel: "", authCode: "", telFormat: false, codeFormat: false },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    setTimeout(wx.hideLoading, 500)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  loginType(e) {
    this.setData({
      mode: parseInt(e.currentTarget.dataset.type)
    })
  },
   /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (!this.data.$state.userInfo.mobile)
      wx.reLaunch({
        url: '/pages/login/login',
      })
  },
  /* 授权获取电话号码 */
  getPhoneNumber: function(e) {
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      let param = {
        mobileEncryptedData: e.detail.encryptedData,
        mobileiv: e.detail.iv,
        tempCode: app.globalData.tempCode,
        invite_uid: wx.getStorageSync("invite") /* 邀请码 */
      }
      this.login(param)
    } else {
      return
    }
  },
  /* 输入电话号码 */
  inputTel(e) {
    this.params.tel = e.detail.value
    this.params.telFormat = app.util.isPoneAvailable(this.params.tel)
  },
  /* 输入验证码 */
  inputCode(e) {
    this.params.authCode = e.detail.value.replace(/^\s+|\s+$/g, '');
  },
  /* 获取验证码 */
  getCode() {
    if (this.params.telFormat) {
      /* send  code */
      // this.countDown()
      app.user.getAuthCode({ mobile: this.params.tel }).then(res =>{
        this.setData({
          btnName: "重新获取",
        }) 
        res.code !== 1 ? wx.showToast({
          title: res.msg,
          icon: "none",
          duration: 1500,
          mask: false
        }) : this.countDown()
      })
    } else {
      wx.showToast({
        title: res.msg,
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
    if (!this.params.telFormat) {
      wx.showToast({
        title: "电话号码格式不对",
        icon: "none",
        duration: 1500,
        mask: false
      })
    }  else {
      let params = {
        tempCode: app.globalData.tempCode,
        mobile: this.params.tel,
        captcha: this.params.authCode,
        invite_uid: wx.getStorageSync("invite") /* 邀请码 */
      }
      this.login(params)
    }
  },
  /* 登录请求 */
  login(param) {
    app.user.register(param).then(res => {
      if (res.code === 1) {
        /* 新用户注册不用提示签到 */
        app.setSignIn({ status: false, count: 1 })
        wx.setStorageSync("token", res.data.token)
        wx.setStorageSync("uid", res.data.uid)
        wx.setStorageSync("authKey", res.data.authKey)
        app.setUser(res.data.userInfo)
        app.setAuthKey(res.data.authKey)
        if (res.data.userInfo.mobile) {
          if (app.globalData.query.type == "share") {
            let params = []
            for (let attr in app.globalData.query) {
              params.push(attr + "=" + app.globalData.query[attr])
            }
            wx.redirectTo({ url: app.globalData.path + "?" + params.join("&") })
          } else {
            /*跳转首页*/
            wx.redirectTo({ url: "/pages/index/index" })
          }
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none",
          duration: 1500,
          mask: false
        })
      }
    })
  },
  checkboxChange: function (e) {
    console.log(this.data.check)
    if(this.data.check) {
      this.setData({
        check: false
      })
    }else {
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
