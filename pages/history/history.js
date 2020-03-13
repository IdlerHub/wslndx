const app = getApp()
//Page Object
Page({
  data: {
    history: [],
    isRefreshing: false
  },
  pageName: '学习历史',
  //options(Object)
  onLoad: function (options) {
    this.historyParam = { page: 1, pageSize: 10 }
    // this.getHistory([])
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
    this.setData({
      isRefreshing: true
    })
    this.historyParam.page = 1
    this.getHistory([]).then(() => {
      this.setData({
        isRefreshing: false
      })
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom: function () {
    if (this.historyParam.page < this.historyParam.max) {
      this.historyParam.page++
      this.getHistory()
    }
  },
  getHistory(list) {
    let temp = list || this.data.history.history
    return app.user.history(this.historyParam).then(msg => {
      for (let i in msg.data.history) {
        msg.data.history[i].forEach(function (item) {
          item.createtime = app.util.formatTime(new Date(item.createtime * 1000)).slice(10)
        })
        temp.push({ date: i, data: msg.data.history[i] })
      }
      this.setData({
        "history.history": temp,
        "history.last_lesson": msg.data.last_lesson || ""
      })
      this.historyParam.max = msg.data.total_page
    })
  }
})
