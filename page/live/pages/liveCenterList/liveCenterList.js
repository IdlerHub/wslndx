// page/live/pages/liveCenterList/liveCenterList.js
Page({
  data: {
    lessons: [
      {
        cover:
          "https://hwcdn.jinlingkeji.cn/uploads/images/3cad1e131c4ba76fa75027911ead53a6.jpg",
        description: "国学易经课",
        end_day: "8月30日",
        end_time: "02:00",
        id: 25,
        is_own: 1,
        name: "国学易经课",
        start_day: "8月1日",
        start_time: "00:00",
        teacher: "易大师",
        week: 1,
      },
      {
        cover:
          "https://hwcdn.jinlingkeji.cn/uploads/images/3cad1e131c4ba76fa75027911ead53a6.jpg",
        description: "国学易经课",
        end_day: "8月30日",
        end_time: "02:00",
        id: 25,
        is_own: 1,
        name: "国学易经课",
        start_day: "8月1日",
        start_time: "00:00",
        teacher: "易大师",
        week: 1,
      },
    ],
  },
  onLoad: function (options) {},
  toDetail(e) {
    let { lessonId, own } = e.currentTarget.dataset;
    let url = "/page/live/pages/tableDetail/tableDetail?lessonId=" + lessonId;
    if (own) {
      url = "/page/live/pages/liveDetail/liveDetail?lessonId=" + lessonId;
    }
    wx.navigateTo({
      url,
    });
  },
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
