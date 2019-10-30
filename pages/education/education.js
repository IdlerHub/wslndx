//Page Object
Page({
  data: {
    url: ""
  },
  onLoad: function(options) {
    console.log(options.type)
    if (options.type === 'farm') {
      this.junmpOut('https://h5xyx.jinlingkeji.cn')
    } else if (options.type === 'station') {
      this.junmpOut('https://open.ximalaya.com/site/index/174/ca5492cf55806b41713dada77a1d2ed5')
    } else {
      console.log(options)
      if (options.login) {
        if (options.login == 0) {
          this.junmpOut(options.url)
        } else {
          this.setData({
            url: options.url + "?mobile=" + encodeURIComponent(this.data.$state.userInfo.mobile) + "&authKey=" + encodeURIComponent(this.data.$state.authKey)
          })
        }
      }else {
        this.junmpOut(options.url)
      }
      
    }
    // console.log(options.url)
    this.junmpOut()
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onPageScroll: function() {},
  junmpOut(url) {
    this.setData({
      // url: this.data.$state.activityUrl + "mobile=" + encodeURIComponent(this.data.$state.userInfo.mobile) + "&authKey=" + encodeURIComponent(this.data.$state.authKey)
     url
    })
  }
})
