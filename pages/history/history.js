const app = getApp()
//Page Object
Page({
  data: {
    history: [],
    isRefreshing: false
  },
  //options(Object)
  onLoad: function(options) {
    this.historyParam = { page: 1, pageSize: 10 }
    this.getHistory([])
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {
    app.aldstat.sendEvent("退出", { name: "学习历史" })
  },
  onPullDownRefresh: function() {
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
  onReachBottom: function() {
    this.historyParam.page++
    this.getHistory()
  },
  getHistory(list) {
    let temp = list || this.data.history.history
    return app.user.history(this.historyParam).then(msg => {
      if (msg.code == 1) {
        for (let i in msg.data.history) {
          msg.data.history[i].forEach(function(item) {
            item.createtime = app.util.formatTime(new Date(item.createtime * 1000)).slice(10)
          })
          temp.push({ date: i, data: msg.data.history[i] })
        }
        this.setData({
          "history.history": temp,
          "history.last_lesson": msg.data.last_lesson
        })
      }
    })
  }
})
