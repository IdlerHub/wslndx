// page/study/pages/history/history.js
const app = getApp()
Page({
  data: {
    current: 0,
    liveList: [],
    lessonList: [],
    dayLessonlist: []
  },
  lesssonParams: {
    pageSize: 10,
    pageNum: 1
  },
  liveParams: {
    pageSize: 10,
    pageNum: 1
  },
  onLoad: function (options) {
    this.getLesson()
    this.getLive()
  },
  onShow: function () {

  },
  onPullDownRefresh: function () {

  },
  checkTab(e) {
    this.setData({
      current: e.currentTarget.dataset.current || e.detail.current
    })
  },
  getLesson() {
    let arr = this.data.lessonList
    app.study.centerHistoryLesson(this.lesssonParams).then(res => {
      res.dataList.forEach(item => {
        var date = new Date(item.studydate * 1000)
        item.studydate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日"
      })
      arr.push(...res.dataList)
      this.setData({
        lessonList: arr
      })
      this.getDaylessonlist(arr)
    })
  },
  getLive() {
    let arr = this.data.liveList
    app.study.centerHistoryLive(this.liveParams).then(res => {
      res.dataList.forEach(item => {
        var date = new Date(item.studyDate * 1000)
        item.studyDate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日"
      })
      arr.push(...res.dataList)
      this.setData({
        liveList: arr
      })
    })
  },
  getDaylessonlist(arr) {
    let newArr = [];
    arr.forEach((item, i) => {
      let index = -1;
      let alreadyExists = newArr.some((newItem, j) => {
        if (item.studydate == newItem.time) {
          index = j;
          return true;
        }
      });
      if (!alreadyExists) {
        newArr.push({
          time: item.studydate,
          list: [item]
        });
      } else {
        newArr[index].list.push(item);
      }
    });
    this.setData({
      dayLessonlist: newArr
    })
  },
  bindscrolltolower() {
    if (this.data.current) {
      this.lesssonParams.pageNum += 1
      this.getLesson()
    } else {
      this.liveParams.pageNum += 1
      this.getLive()
    }
  },
  toSpecal(e) {
    wx.navigateTo({
      url: `/page/live/pages/liveDetail/liveDetail?specialColumnId=${e.currentTarget.dataset.id}`,
    })
  },
  toDetail(e) {
    wx.navigateTo({
      url: '/page/index/pages/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  }
})