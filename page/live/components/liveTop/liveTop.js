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
  data: {},
  ready() {
    this.pages = getCurrentPages()
    this.ipages = this.pages[this.pages.length - 1]
  },
  methods: {
    back() {
      console.log(this.pages.length)
      if (this.pages.length > 1 || this.ipages.liveOps.from) {
        if (this.ipages.liveOps.from) {
          console.log()
          wx.redirectTo({
            url: '/page/live/pages/liveDetail/liveDetail?specialColumnId=' + this.data.liveDetail.columnId,
          })
        } else {
          this.data.direction ? wx.navigateBack() : setTimeout(() => {
            wx.navigateBack()
          }, 1000);
        }
      } else {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    },
    attention() {
      this.triggerEvent('checkFollow', 1)
    },
    checknextTap(e) {
      app.checknextTap(e);
    },
  }
})