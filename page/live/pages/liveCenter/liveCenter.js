// page/live/pages/liveCenter/liveCenter.js
Page({
  data: {
    classList: [
      {
        id: 1,
        title: "电脑与摄影",
      },
      {
        id: 2,
        title: "乐器",
      },
      {
        id: 3,
        title: "美术",
      },
      {
        id: 4,
        title: "手机电脑",
      }
    ],
  },
  onLoad: function (options) {},
  toDetail(e) {
    console.log("按类课程中心", e);
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: "/page/live/pages/liveCenterList/liveCenterList",
    });
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onShareAppMessage: function () {},
});