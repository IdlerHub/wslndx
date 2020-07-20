// pages/timetable/timetable.js
Page({
  data: {
    navScrollLeft:0,
    nav: [
      {id:1, name: '周一'},
      {id:2, name: '周二'},
      {id:3, name: '周三'},
      {id:4, name: '周四'},
      {id:5, name: '周五'}
    ],
    currentTab: 0,
    list: [1]
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