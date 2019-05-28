//Page Object
Page({
  data: {
    url: ""
  },
  //options(Object)
  onLoad: function(options) {
    let url = "https://gqjy.jinlingkeji.cn/?"
    this.setData({
      url: url + "mobile=" + encodeURIComponent(this.data.$state.userInfo.mobile) + "&authKey=" + encodeURIComponent(this.data.$state.authKey)
    })
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  onPageScroll: function() {}
})
