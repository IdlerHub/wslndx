// pages/timetableList/timetableList.js
const LiveDate = require("../../data/LiveDate");
Page({
  data: {
    courseListL: [],
  },
  onLoad: function (options) {
    this.getUserLessons();
  },
  onShow: function () {},
  getUserLessons(){
    LiveDate.getUserLessons().then(res=>{
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
