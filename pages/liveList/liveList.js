// pages/liveList/liveLIst.js
const app = getApp()
Page({
  data: {
    roomList: [],
    normalSatuts: [101, 102, 106, 105],
    unStatus: [103, 104, 105, 106, 107],
    active: 0,
    bottomOver: 0,
    height: 0,
    backLive: 0
  },
  onLoad: function (options) {

  },
  onShow: function () {
    this.param = {
      start: 0,
      limit: 10
    }
    this.getLiveList()
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    this.getLiveList(this.data.roomList)
  },
  getLiveList(list) {
    if (this.data.bottomOver) return
    let arr = list ? list : []
    app.classroom.getLiveInfo(this.param).then(res => {
      res.data.room_info.sort((a, b) => {
        return a.start_time - b.start_time
      })
      res.data.room_info.forEach(item => {
        item.startTime = app.util.formatTime(new Date(item.start_time * 1000), 1)
        item.endTime = app.util.formatTime(new Date(item.start_time * 1000)).slice(11) + '-' + app.util.formatTime(new Date(item.end_time * 1000)).slice(11)
        list && this.data.backLive ? '' : item.status == 103 ? '' : this.setData({ backLive : 1 })
      })
      arr = arr.concat(res.data.room_info)
      this.setData({
        roomList: arr
      }, () => {
        this.data.roomList.length >= 10 ? this.param.start = this.param.start + 20 : this.setData({
          bottomOver: 1
        })
        this.getHeight()
      })
    })
  },
  changeActive(e) {
    this.setData({
      active: e.currentTarget.dataset.active
    })
  },
  changeCurrent(e) {
    this.setData({
      active: e.detail.current
    }, () => {
      this.getHeight()
    })
  },
  toLive(e) {
    let item = e.currentTarget.dataset.item,
      customParams = encodeURIComponent(JSON.stringify({
        path: 'pages/index/index',
        uid: this.data.$state.userInfo.id,
        type: 'invite'
      }))
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${item.roomid}&custom_params=${customParams}`
    })
  },
  getHeight() {
    let query = wx.createSelectorQuery().in(this)
    let that = this
    this.data.active == 0 ? query.select('#listImgBox').boundingClientRect() : query.select('#listBackBox').boundingClientRect()
    query.exec(res => {
      let height = res[0].height
      this.setData({
        height: height + 50
      })
    })
  }
})