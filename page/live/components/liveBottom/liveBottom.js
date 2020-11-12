// page/live/components/liveBottom/liveBottom.js
Component({
  properties: {
    close: {
      type: Boolean,
      value: 1
    },
    vliveRoom: {
      type: Boolean,
      value: 0
    },
    columnId: {
      type: Number,
      value: 0
    },
    keyHeight: {
      type: String || Number,
      value: '-60'
    }
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: () => {

    },
  },
  ready() {
    let systemInfo = wx.getSystemInfoSync()
    this.setData({
      system: systemInfo.platform
    })
    // wx.onKeyboardHeightChange(res => {
    //   console.log(res.height)
    //   this.setData({
    //     keyHeight: res.height
    //   }, () => {
    //     setTimeout(() => {
    //       this.data.keyHeight == 0 && !this.data.focus ? this.setData({
    //         keyHeight: '-60'
    //       }) : ''
    //     }, 200);
    //   })
    // })
    this.praiseNum = 0
  },
  data: {
    focus: false,
    keyHeight: '-60',
    txt: '',
    system: 'ios',
    praiseCount: 0
  },
  methods: {
    showBox() {
      this.setData({
        focus: !this.data.focus
      })
    },
    bindinput(e) {
      this.setData({
        txt: e.detail.value
      }, () => {
        this.data.txt.length >= 50 ? wx.showToast({
          title: '内容仅限50字哦',
          icon: 'none'
        }) : ''
      })
    },
    send() {
      this.triggerEvent('sendMsg', this.data.txt)
      this.setData({
        txt: ''
      })
    },
    praise() {
      this.praiseNum += 1
      this.timer ? clearTimeout(this.timer) : ''
      this.timer = setTimeout(() => {
        console.log(this.praiseNum)
        this.triggerEvent('praise', this.praiseNum)
        this.praiseNum = 0
      }, 1000);
    },
    clickHandler() {
      this.triggerEvent('clickHandler')
      // this.setData({
      //   praiseCount: this.data.praiseCount += 1
      // })
    },
    checkCaption() {
      this.triggerEvent('checkCaption')
    },
    toLessons() {
      let pages = getCurrentPages(), back = 0
      pages.forEach(e => {
        e.pageName ? e.pageName == 'liveDetail' ? back = 1 : '' : ''
      })
      back ? wx.navigateBack() : wx.navigateTo({
        url: '/page/live/pages/liveDetail/liveDetail?specialColumnId=' + this.data.columnId,
      })
    }
  }
})