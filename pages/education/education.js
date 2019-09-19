//Page Object
Page({
  data: {
    url: ""
  },
  onLoad: function(options) {
    this.setData({
      // url: this.data.$state.activityUrl + "mobile=" + encodeURIComponent(this.data.$state.userInfo.mobile) + "&authKey=" + encodeURIComponent(this.data.$state.authKey)
      url:'https://open.ximalaya.com/site/index/174/ca5492cf55806b41713dada77a1d2ed5'
    })
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onPageScroll: function() {}
})
