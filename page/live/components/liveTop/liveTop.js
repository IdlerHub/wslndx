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
    },
    vliveRoom: {
      type: Boolean,
      value: 0
    },
    statusBarHeight: {
      type: Number,
      value: 30
    },
  },
  data: {
  },
  ready() {
    this.pages = getCurrentPages()
  },
  methods: {
    back() {
      if (this.pages.length > 1) {
        this.data.direction ? wx.navigateBack() : setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      } else {
        wx.switchTab({
          url: '/pages/timetableList/timetableList'
        })
      }
    },
    attention() {
      app.liveData.follow({ followerUid: this.data.liveDetail.lecturerUserId }).then(() => {
        wx.showToast({
          title: '关注成功',
          icon: 'none'
        })
        this.triggerEvent('checkFollow')
      })
    },
  }
})