// page/live/pages/liveCenterList/liveCenterList.js
const LiveData = require("../../../../data/LiveData");
Page({
  data: {
    lessons: [],
    center_id: 0,
    page: 1,
    total_page: 1,
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      center_id: options.center_id,
    });
    this.getLessonCenterClass(options.center_id);
  },
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
  getLessonCenterClass(center_id, page = 1) {
    let params = {
      center_id,
      page,
    };
    let lessons = this.data.lessons;
    return LiveData.getLessonCenterClass(params).then((res) => {
      if(page == 1) lessons = res.data.list;
      if(page != 1 && res.data.list.length != 0) {
        lessons.push(...res.data.list);
      }
      this.setData({
        lessons,
        page,
        total_page: res.data.total_page,
      });
      console.log(res);
    });
  },
  onPullDownRefresh: function () {
    this.setData({
      lessons: [],
      page: 1,
      total_page: 1
    })
    this.getLessonCenterClass(this.data.center_id).then(res=>{
      wx.stopPullDownRefresh();
      wx.showToast({
        title: "刷新完成",
        duration: 1000,
      });
    });
  },
  onReachBottom: function () {
    this.getLessonCenterClass(this.data.center_id,this.data.page++);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
