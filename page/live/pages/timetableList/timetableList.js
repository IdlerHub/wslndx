// pages/timetableList/timetableList.js
const LiveData = require("../../data/LiveData");
Page({
  data: {
    courseListL: [],
  },
  onLoad: function (options) {
    this.getUserLessons();
  },
  onShow: function () {},
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
