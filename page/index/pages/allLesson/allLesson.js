// page/index/pages/allLesson/allLesson.js
Page({
  data: {
    current: 0
  },
  onLoad: function (options) {
    let navList = [
      {
        id: 1,
        name: '健康养生'
      },
      {
        id: 2,
        name: '语言系'
      },
      {
        id: 3,
        name: '美术书法'
      },
      {
        id: 4,
        name: '国学文化'
      },
      {
        id: 5,
        name: '生活艺术'
      },
      {
        id: 6,
        name: '手机电脑'
      },
      {
        id: 7,
        name: '形象管理'
      },
      {
        id: 8,
        name: '舞蹈形体'
      },
      {
        id: 9,
        name: '健康养生'
      },
      {
        id: 10,
        name: '体育保健'
      },
      {
        id: 11,
        name: '乐器系'
      },
    ]
    this.setData({
      navList
    })
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
  navChange(e) {
    let index = e.currentTarget.dataset.index, id = e.currentTarget.id
    this.setData({
      current: index
    })
  },
  swiperChange(e) {
    if(e.detail.current == this.data.current) return
    this.setData({
      current: e.detail.current
    })
  }
})