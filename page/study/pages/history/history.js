// page/study/pages/history/history.js
const app = getApp()
Page({
  data: {
    current: 0,
    liveList: [],
    lessonList: []
  },
  lesssonParams: {
    pageSize: 10,
    pageNum: 1
  },
  onLoad: function (options) {
    this.getLesson()
  },
  onShow: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  init() {

  },
  checkTab(e) {
    this.setData({
      current: e.currentTarget.dataset.current ||  e.detail.current
    })
  },
  getLesson() {
    let arr = this.data.lessonList
    app.study.centerHistoryLesson(this.lesssonParams).then(res => {
      res.dataList.forEach(item => {
        item.studydate = app.util.dateUnit(item.studydate)
      })
      arr.push(...res.dataList)
      this.setData({
        lessonList: arr
      })
    })
  }
})