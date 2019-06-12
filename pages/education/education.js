//Page Object
Page({
  data: {
    url: ""
  },
  onLoad: function(options) {
    this.setData({
      url: this.data.$state.activityUrl + "mobile=" + encodeURIComponent(this.data.$state.userInfo.mobile) + "&authKey=" + encodeURIComponent(this.data.$state.authKey)
    })
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  /* onShareAppMessage: function() {}, */
  onPageScroll: function() {}
})
