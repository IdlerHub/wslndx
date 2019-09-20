//Page Object
Page({
  data: {
    url: ""
  },
  onLoad: function(options) {
    console.log(options.type)
    if (options.type === 'farm') {
      this.junmpOut('https://h5xyx.jinlingkeji.cn/h5game')
    } else if (options.type === 'station') {
      this.junmpOut('https://open.ximalaya.com/site/index/174/ca5492cf55806b41713dada77a1d2ed5')
    } else {
      this.junmpOut(options.url)
    }
    console.log(options.url)
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
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
