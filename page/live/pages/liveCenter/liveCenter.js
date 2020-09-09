// page/live/pages/liveCenter/liveCenter.js
const LiveData = require("../../../../data/LiveData");
const app = getApp();
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
      },
    ],
    page: 1,
    total_page: 1,
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
  getLessonCenter(page = 1) {
    let params = {
      page,
    }
    let classList = this.data.classList;
    LiveData.getLessonCenter(params).then((res) => {
      console.log(res);
      if (page == 1) classList = res.data.list;
      if (page != 1 && res.data.list.length != 0) {
        classList.push(...res.data.list);
      }
      this.setData({
        classList,
        total_page: res.data.total_page,
        page
      });
    });
  },
  onReachBottom() {
    console.log("上拉加载")
    this.getLessonCenter(this.data.page++);
  },
  onShareAppMessage: function () {},
});