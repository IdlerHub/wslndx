// pages/timetable/timetable.js
Page({
  data: {
    navScrollLeft:0,
    nav: [
      {id:1, name: '全部'},
      {id:2, name: '直播'},
      {id:3, name: '科学'},
      {id:4, name: '种植'},
      {id:5, name: '舞蹈'},
      {id:6, name: '交易'},
      {id:7, name: '绘画'},
      {id:8, name: '书法'},
      {id:9, name: '全部'},
      {id:10, name: '全部'},
      {id:11, name: '全部'},
    ],
    currentTab: 0,
    list: []
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  switchNav(event) {
    let cur = event.currentTarget.dataset.current, id = event.currentTarget.dataset.id
    if (this.data.currentTab != cur) {
      this.setData({
        currentTab: cur
      })
    }
    if (this.data.currentTab == 0) {
      this.setData({
        navScrollLeft: 0
      })
    }
  },
})