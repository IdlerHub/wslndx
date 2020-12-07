// pages/timetableList/timetableList.js
const LiveData = require("../../data/LiveData");
Page({
  data: {
    courseList: [],
    weekList: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    weeks: [],
    today: '',
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
          month: e.title,
          today: e.date
        }), this.getUserLessons(e.date)] : ''
      })
    })
  },
  toDetail(e) {

    if (!e.currentTarget.dataset.status || e.currentTarget.dataset.status == 1) {
      wx.navigateTo({
        url: "/page/live/pages/vliveRoom/vliveRoom?roomId=" + e.currentTarget.dataset.liveid,
      });
    } else {
      let url = ''
      LiveData.getLiveBySpecialColumnId({
        specialColumnId: e.currentTarget.dataset.lessonId
      }).then(res => {
        res.data.isAddSubscribe ? url = "/page/live/pages/liveDetail/liveDetail?specialColumnId=" +
          e.currentTarget.dataset.lessonId : url =
          "/page/live/pages/tableDetail/tableDetail?specialColumnId=" +
          e.currentTarget.dataset.lessonId
        wx.navigateTo({
          url,
        });
      })
    }
  },
  getUserLessons(date) {
    this.params.date = new Date(date).valueOf()
    let list = this.data.courseList
    return LiveData.newUserLessons(this.params).then((res) => {
      let date = new Date(),
        dataTime = ''
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
    this.setData({
      courseList: [],
      pageEnd: 0
    })
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
  },
  getPewWeeks(date) {
    // 一天里一共的毫秒数
    let oneDayTime = 1000 * 60 * 60 * 24
    let today = new Date(date)
    // 若那一天是周末时，则强制赋值为7
    let todayDay = today.getDay() || 7
    let startDate = new Date(
      today.getTime() - oneDayTime * (todayDay - 1)
    )
    let weeks = Array.from(new Array(7))
      .map((_, i) => {
        let temp = new Date(startDate.getTime() + i * oneDayTime)
        let date = temp.getFullYear() +
          '-' +
          ((temp.getMonth() + 1) < 10 ? '0' + (temp.getMonth() + 1) : (temp.getMonth() + 1)) +
          '-' +
          (temp.getDate() < 10 ? '0' + temp.getDate() : temp.getDate())
        return {
          name: this.data.weekList[i],
          week: i + 1,
          title: temp.getFullYear() + '年' + ((temp.getMonth() + 1) < 10 ? '0' + (temp.getMonth() + 1) : temp.getMonth() + 1),
          day: temp.getDate() < 10 ? '0' + temp.getDate() : temp.getDate(),
          date,
          is_today: date == this.data.today ? 1 : 0
        }
      })
    return weeks
  },
  pickerChange(e) {
    let date = e.detail.value
    this.setData({
      weeks: this.getPewWeeks(String(date)),
      courseList: [],
      pageEnd: 0
    }, () => {
      this.params = {
        date: '',
        pageSize: 20,
        pageNum: 1
      }
      this.data.weeks.forEach((e, i) => {
        date == e.date ? [this.setData({
          current: i,
          month: e.title,
        }), this.getUserLessons(e.date)] : ''
      })
    })
  },
  pickerCancel() {
    console.log('picker取消')
  }
});