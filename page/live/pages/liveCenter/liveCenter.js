// page/live/pages/liveCenter/liveCenter.js
const LiveData = require("../../../../data/LiveData");
const app = getApp();
Page({
  data: {
    classList: [],
  },
  onLoad: function (options) {
    this.getLessonCenter();
  },
  toDetail(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/page/live/pages/liveCenterList/liveCenterList?center_id=${item.id}`,
    });
  },
  getLessonCenter() {
    LiveData.getLessonCenter().then((res) => {
      this.setData({
        classList: res.data,
      });
    });
  },
  onShareAppMessage: function () {},
});