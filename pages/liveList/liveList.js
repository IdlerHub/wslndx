// pages/liveList/liveLIst.js
const app = getApp()
const livePlayer = requirePlugin('live-player-plugin')
Page({
  data: {
    roomList: [],
    normalSatuts: [101, 102, 106, 105],
    unStatus: [103, 104, 105, 106, 107],
    active: 0,
    bottomOver: 0,
    height: 0,
    backLive: 0,
    living: 0,
    refresher: false
  },
  timer: null,
  onLoad: function (options) {
    this.getLiveList()
  },
  onShow: function () {
    this.param = {
      start: 0,
      limit: 20
    }
    this.data.roomList.length > 0 ? this.getRoomstatus() : ''
  },
  onUnload:function () {
    clearInterval(this.timer)
  },
  nextLivelist() {
    if (this.data.bottomOver) return
    this.getLiveList(this.data.roomList)
  },
  getLiveList(list) {
    let arr = list ? list : [],
      n = 0,
      n2 = 0;
    app.classroom.getLiveInfo(this.param).then(res => {
      res.data.room_info.sort((a, b) => {
        return a.start_time - b.start_time
      })
      res.data.room_info.forEach(item => {
        item.startTime = app.util.formatTime(new Date(item.start_time * 1000), 1)
        item.endTime = app.util.formatTime(new Date(item.start_time * 1000)).slice(11) + '-' + app.util.formatTime(new Date(item.end_time * 1000)).slice(11)
        list && this.data.backLive ? '' : item.live_status == 103 ? n += 1 : ''
        list && this.data.living ? '' : this.data.normalSatuts.indexOf(item.live_status) == -1 ? '' : n2 += 1
      })
      n > 0 ? '' : this.setData({
        backLive: 1
      })
      n2 > 0 ? '' : this.setData({
        living: 1
      }) 
      arr = arr.concat(res.data.room_info)
      this.setData({
        roomList: arr,
        refresher: false
      }, () => {
        this.data.roomList.length >= 10 ? this.param.start = this.param.start + 20 : this.setData({
          bottomOver: 1
        })
        this.getRoomstatus()
        this.timer ? clearInterval(this.timer) : ''
        this.timer = setInterval(() => {
           this.getRoomstatus()
        }, 60000);
      })
    })
  },
  upLivelist() {
    this.param = {
      start: 0,
      limit: 20
    }
    this.getLiveList()
  },
  getRoomstatus() {
    this.data.roomList.forEach((item, index) => {
      livePlayer.getLiveStatus({
          room_id: item.roomid
        })
        .then(res => {
          // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常，107：已过期 
          this.setData({
            [`roomList[${index}].live_status`]: res.liveStatus
          })
        })
        .catch(err => {
          console.log('get live status', err)
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
  }
})