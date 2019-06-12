const app = getApp()
//Page Object
Page({
  data: {
    collect: [],
    isRefreshing: false
  },
  //options(Object)
  onLoad: function(options) {
    this.collectParam = { page: 1, pageSize: 10 }
    this.getCollect([])
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {
    app.aldstat.sendEvent("退出", { name: "收藏课程" })
  },
  onPullDownRefresh: function() {
    this.setData({
      isRefreshing: true
    })
    this.collectParam.page = 1
    this.getCollect([]).then(() => {
      this.setData({
        isRefreshing: false
      })
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom: function() {
    this.collectParam.page++
    this.getCollect()
  },
  getCollect(list) {
    let collect = list || this.data.collect
    return app.user.collect(this.collectParam).then(msg => {
      if (msg.code == 1) {
        msg.data.forEach(function(item) {
          item.thousand = app.util.tow(item.browse)
        })
        this.setData({
          collect: collect.concat(msg.data)
        })
      }
    })
  }
})
