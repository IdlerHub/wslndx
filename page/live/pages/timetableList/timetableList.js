// pages/timetableList/timetableList.js
const LiveData = require("../../../../data/LiveData");
Page({
  data: {
    courseListL: [],
  },
  onLoad: function (options) {
    this.getUserLessons();
  },
  toDetail(e){
    console.log("去详情页面")
    let url =
      "/page/live/pages/liveDetail/liveDetail?lessonId=" +
      e.currentTarget.dataset.lessonId;
    wx.navigateTo({
      url,
    });
  },
  getUserLessons(){
    LiveData.getUserLessons().then(res=>{
      console.log(res)
      this.setData({
        courseListL: res.data,
      });
    });
  },
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onShareAppMessage: function () {},
});
