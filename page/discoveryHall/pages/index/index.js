// page/discoveryHall/pages/index/index.js
Page({
  data: {
    showOverlay: true,
    overlayType: 1,
  },
  onLoad: function (options) {

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
  onShareAppMessage: function () {

  },
  // 规则显示隐藏
  onClickHid(e) {
    this.setData({
      showOverlay: !this.data.showOverlay,
      overlayType: Number(e.currentTarget.dataset.type)
    })
  },
  onChange(e) {
    console.log(e, 324234)
  }
})