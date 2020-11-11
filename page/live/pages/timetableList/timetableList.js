// pages/timetableList/timetableList.js
const LiveData = require("../../../../data/LiveData");
Page({
  data: {
    courseList: [],
    page: 1,
    page_end: false
  },
  onLoad: function (options) {
    this.params = {
      type: 0,
      pageSize: 20,
      pageNum: 1
    }
    this.getUserLessons()
  },
  toDetail(e) {
    let url =
      "/page/live/pages/liveDetail/liveDetail?specialColumnId=" +
      e.currentTarget.dataset.lessonId;
    wx.navigateTo({
      url,
    });
  },
  getUserLessons() {
    let list = this.data.courseList
    return LiveData.studyCenterspecial(this.params).then((res) => {
      list.push(...res.dataList)
      this.setData({
        courseList: list,
        page_end: res.total < 10 ? 1 : 0
      });
    });
  },
  onReachBottom() {
    if (this.data.page_end) return
    this.params.pageNum++
    this.getUserLessons()
  },
  onPullDownRefresh() {
    this.params = {
      type: 0,
      pageSize: 20,
      pageNum: 1
    }
    this.setData({
      courseList: []
    }, () => {
      this.getUserLessons().then(() => {
        wx.stopPullDownRefresh();
        wx.showToast({
          title: "刷新完成",
          duration: 1000,
        });
      })
    })
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
  }
});