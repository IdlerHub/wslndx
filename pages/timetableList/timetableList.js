// pages/timetableList/timetableList.js
const LiveData = require("../../data/LiveData");
Page({
  data: {
    courseList: [],
    weekList: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    weeks: [],
    page: 1,
    current: 0,
    month: '',
    pageEnd: false
  },
  onLoad: function (options) {
    // this.getLessonWeeks()
    this.params = {
      date: '',
      pageSize: 20,
      pageNum: 1
    }
    this.getWeekDate()
  },
  getWeekDate() {
    let dateOfToday = Date.now()
    let dayOfToday = (new Date().getDay() + 7 - 1) % 7
    let weeks = Array.from(new Array(7))
      .map((_, i) => {
        let date = new Date(dateOfToday + (i - dayOfToday) * 1000 * 60 * 60 * 24)
        return {
          name: this.data.weekList[i],
          week: i + 1,
          title: date.getFullYear() + '年' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
          day: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
          date: date.getFullYear() +
            '-' +
            ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) +
            '-' +
            (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()),
          is_today: dayOfToday == i ? 1 : 0
        }
      })
    this.setData({
      weeks
    }, () => {
      weeks.forEach((e, i) => {
        e.is_today ? [this.setData({
          current: i,
          month: e.title
        }), this.getUserLessons(e.date)] : ''
      })
    })
  },
  toDetail(e) {
    let url = ''
    if (!e.currentTarget.dataset.status) {
      url =
        "/page/live/pages/vliveRoom/vliveRoom?roomId=" +
        e.currentTarget.dataset.liveid;
    } else {
      url =
        "/page/live/pages/liveDetail/liveDetail?specialColumnId=" +
        e.currentTarget.dataset.lessonId;
    }
    wx.navigateTo({
      url,
    });
  },
  getUserLessons(date) {
    this.params.date = new Date(date).valueOf()
    let list = this.data.courseList
    return LiveData.newUserLessons(this.params).then((res) => {
      list.push(...res.dataList)
      this.setData({
        courseList: list,
        pageEnd: res.total < 10 ? 1 : 0
      });
    });
  },
  onReachBottom() {
    if (this.data.pageEnd) return
    this.params.pageNum++
    this.getUserLessons(this.data.weeks[this.data.current].date)
  },
  onPullDownRefresh() {
    this.params = {
      date: '',
      pageSize: 20,
      pageNum: 1
    }
    this.getUserLessons(this.data.weeks[this.data.current].date).then(() => {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: "刷新完成",
        duration: 1000,
      });
    })
  },
  onShareAppMessage: function (ops) {
    if (ops.from === "button") {
      let item = ops.target.dataset.item;
      return {
        title: item.liveName,
        imageUrl: item.indexCover,
        path: "/page/live/pages/liveDetail/liveDetail?specialColumnId=" +
          item.columnId
      };
    }
  },
  checkCurrent(e) {
    this.setData({
      current: e.currentTarget.dataset.index,
      month: e.currentTarget.dataset.month,
      courseList: []
    }, () => {
      wx.pageScrollTo({
        duration: 0,
        scrollTop: 0
      })
      this.params = {
        date: '',
        pageSize: 20,
        pageNum: 1
      }
      this.getUserLessons(this.data.weeks[this.data.current].date)
    })
  }
});