// pages/timetableList/timetableList.js
const LiveData = require("../../../../data/LiveData");
Page({
  data: {
    courseListL: [],
    weekList: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    page: 1,
    page_end: false
  },
  onLoad: function (options) {
    this.getUserLessons();
  },
  toDetail(e) {
    console.log("去详情页面");
    let url =
      "/page/live/pages/liveDetail/liveDetail?lessonId=" +
      e.currentTarget.dataset.lessonId;
    wx.navigateTo({
      url,
    });
  },
  getUserLessons(page = 1) {
    let courseListL = this.data.courseListL;
    return LiveData.getUserLessons({ page }).then((res) => {
      console.log(res);
      if(page == 1) courseListL = [];
      courseListL.push(...res.data);
      if(res.data.length != 0){
        this.setData({
          courseListL,
          page: page + 1,
        });
      }else{
        this.data.page_end = true;  //已经加载完毕
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
});
