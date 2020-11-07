// page/live/components/liveTop/liveTop.js
const app = getApp()
Component({
  properties: {
    liveDetail: {
      type: Object,
      value: {}
    },
    liveCount: {
      type: Number,
      value: 0
    }
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
    },
    attention() {
      app.liveData.follow({ followerUid: this.data.liveDetail.lecturerUserId }).then(() => {
        wx.showToast({
          title: '关注成功',
          icon: 'none'
        })
        this.triggerEvent('checkFollow')
      })
    }
  }
})