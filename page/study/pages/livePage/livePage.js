// page/study/pages/livePage/livePage.js
const app = getApp()
Page({
  data: {
    liveList: [],
  },
  liveParams: {
    pageNum: 1,
    pageSize: 10,
  },
  onLoad: function (options) {
    this.getMylive()
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    this.liveParams.pageNum += 1
    this.getMylive()
  },
  getMylive() {
    let arr = this.data.liveList
    app.study.centerLive(this.liveParams).then(res => {
      res.dataList.forEach(item => {
        item.studydate = app.util.formatTime(new Date(item.startTime * 1000)).substring(0,10) == app.util.formatTime(new Date()).substring(0,10) ? '今天' + app.util.formatTime(new Date(item.startTime * 1000)).substring(10) :  app.util.formatTime(new Date(item.startTime * 1000), 1)
      })
      arr.push(...res.dataList)
      this.setData({
        liveList: arr
      })
    })
  },
})