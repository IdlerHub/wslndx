// page/discoveryHall/pages/detail/detail.js
Page({
  data: {
    statusBarHeight: 30,
    value: 0,
    gradientColor: {
      '0%': '#ffd01e',
      '100%': '#ee0a24',
    },
    time: 15 * 1000,
    timeData: {}
  },
  onLoad: function (options) {
    this.setData({
      statusBarHeight: wx.getSystemInfoSync().statusBarHeight + 12
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function (ops) {
    if (ops.from === "menu") {
      return this.menuAppShare();
    }
    if (ops.from === "button") {
      return {
        title: '视频详情',
        imageUrl: "/images/sharemessage.jpg",
        path: "/page/discoveryHall/pages/videoDetail/videoDetail?id=" +
          1 +
          "&type=share&uid=" +
          this.data.$state.userInfo.id
      };
    }
  },
  onChange(e) {
    this.setData({
      timeData: e.detail,
      value: this.data.value + Math.ceil(100 / 15)
    });
  },
  toBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
    } else {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  }
})