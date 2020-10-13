// page/index/pages/hotActivity/hotActivity.js
Page({
  data: {
    current: 0
  },
  onLoad: function (options) {
    let swiperList = [
      { id: 1},
      { id: 2},
      { id: 3},
      { id: 4},
      { id: 5},
      { id: 6},
    ],
    activityList = [
      // { id: 1},
      // { id: 2},
      // { id: 3},
      // { id: 4},
      // { id: 5},
      // { id: 6},
    ]
    this.setData({
      swiperList,
      activityList
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  centerTab(e) {
    this.setData({
      current: e.detail.current
    })
  },
})