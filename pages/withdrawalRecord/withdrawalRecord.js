// pages/withdrawalRecord/withdrawalRecord.js
const app = getApp()
Page({
  data: {
    list:[]
  },
  onLoad: function (options) {
    let list = [
      {num: '50',createtime: '1582507826',status: 0},
      {num: '100',createtime: '1582507826',status: 1},
      {num: '0.5',createtime: '1582507826',status: 0},
      {num: '10',createtime: '1582507826',status: 1},
      {num: '1',createtime: '1582507826',status: 0},
    ]
    list.forEach(v => {
      v.time = app.util.formatTime(new Date(v.createtime * 1000))
    })
    this.setData({
      list
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
  onShareAppMessage: function () {
  }
})