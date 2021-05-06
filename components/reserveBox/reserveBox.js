// components/reserveBox/reserveBox.js
const app = getApp()
Component({
  properties: {
    liveId: {
      type: Number,
      value: 0
    },
    isHlive: {
      type: Boolean,
      value: false
    },
    isLessonDetail: {
      type: String,
      value: ''
    }
  },
  data: {
    show: true,
    showSetting: false,
    showReserveBox: false
  },
  ready() {
    this.page = getCurrentPages()[getCurrentPages().length - 1]
  },
  methods: {
    reverve() {
      this.setData({
        showReserveBox: false
      })
      if(this.data.liveId > 0) {
         app.subscribeMessage(this.data.liveId)
      } else if(this.data.isLessonDetail != '') {
        app.subscribeMessage(null, this.page, this.data.isLessonDetail)
      } else {
        app.subscribeMessage()
      }
    },
    restSetting() {
      wx.openSetting()
      this.setData({
        showReserveBox: true
      })
      this.page.setData({
        showReserveBox: false
      })
    },
    close() {
      if((this.data.showSetting || this.data.showReserveBox) && this.data.isLessonDetail != '') {
        this.page[this.data.isLessonDetail]()
      }
      this.page.setData({
        showReserveBox: false
      })
      this.setData({
        show: true,
        showSetting: false,
        showReserveBox: false
      })
    }
  }
})