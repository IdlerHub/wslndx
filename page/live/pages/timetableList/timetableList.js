// pages/timetableList/timetableList.js
const LiveData = require("../../../../data/LiveData");
Page({
  data: {
    courseList: [],
    weekList: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    page: 1,
    isToday:3, 
    current: 0,
    page_end: false
  },
  onLoad: function (options) {
    this.getUserLessons();
  },
  toDetail(e) {
    let url =
      "/page/live/pages/liveDetail/liveDetail?lessonId=" +
      e.currentTarget.dataset.lessonId;
    wx.navigateTo({
      url,
    });
  },
  getUserLessons(page = 1) {
    let courseList = this.data.courseList;
    return LiveData.getUserLessons({ page }).then((res) => {
      if(page == 1) courseList = [];
      if(res.data.length != 0){
        courseList.push(...res.data);
        this.setData({
          courseList,
          page: page + 1,
        });
      }else{
        this.setData({
          page_end: true,
        })
      }
    });
  },
  onReachBottom(){
    if(!this.data.page_end){
      this.getUserLessons(this.data.page);
    }
  },
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
  onShareAppMessage: function () {},
  checkCurrent(e) {
    this.setData({
      current: e.currentTarget.dataset.index
    })
  }
});
