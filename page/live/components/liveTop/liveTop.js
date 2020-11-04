// page/live/components/liveTop/liveTop.js
Component({
  properties: {

  },
  data: {
    top: 0,
    moveBox: 0,
    showBox:0
  },
  ready() {
    let systemInfo = wx.getSystemInfoSync()
    systemInfo.statusBarHeight < 30 ?
      this.setData({
        top: systemInfo.statusBarHeight + 4
      }) :
      this.setData({
        top: systemInfo.statusBarHeight
      });
    this.pages = getCurrentPages()
  },
  methods: {
    back() {
      if (this.pages.length > 1) {
        wx.navigateBack()
      } else {
        wx.switchTab({
          url: '/pages/timetable/timetable'
        })
      }
    },
    showBox(e) {
      e.currentTarget.dataset.top ? 
      this.setData({
        showBox: 1,
        moveBox: 1
      }) : this.setData({
        moveBox: 0
      })
    }
  }
})