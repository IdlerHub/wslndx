// pages/timetableList/timetableList.js
const LiveData = require("../../../../data/LiveData");
Page({
  data: {
    courseList: [],
    weekList: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    weeks: [],
    page: 1,
    current: 0,
    month: '',
    page_end: false
  },
  onLoad: function (options) {
    this.getLessonWeeks()
  },
  toDetail(e) {
    let url =
      "/page/live/pages/liveDetail/liveDetail?lessonId=" +
      e.currentTarget.dataset.lessonId;
    wx.navigateTo({
      url,
    });
  },
  getUserLessons(current, week) {
    return LiveData.newUserLessons({
      page_size: 100,
      week
    }).then((res) => {
      this.setData({
        courseList: res.data
      });
    });
  },
  getLessonWeeks() {
    LiveData.getLessonWeeks().then(res => {
      this.setData({
        weeks: res.data
      })
      res.data.forEach((e, i) => {
        e.is_today ? [this.setData({
          current: i,
          month: e.title
        }), this.getUserLessons(i, e.week)] : ''
      })
    })
  },
  onReachBottom() {},
  onPullDownRefresh() {
    this.getUserLessons()
      .then(() => {
        this.setData({
          page_end: false,
        });
        wx.stopPullDownRefresh();
        wx.showToast({
          title: "刷新完成",
          duration: 1000,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  onShareAppMessage: function (ops) {
    console.log(ops)
    if (ops.from === "button") {
      let item = ops.target.dataset.item;
      return {
        title: item.name,
        imageUrl: item.cover,
        path: "/page/live/pages/liveDetail/liveDetail?lessonId=" +
        item.id
      };
    }
  },
  checkCurrent(e) {
    this.setData({
      current: e.currentTarget.dataset.index
    }, () => {
      wx.pageScrollTo({
        duration: 0,
        scrollTop: 0
      })
      this.getUserLessons(e.currentTarget.dataset.index, this.data.weeks[e.currentTarget.dataset.index].week)
    })
  }
});