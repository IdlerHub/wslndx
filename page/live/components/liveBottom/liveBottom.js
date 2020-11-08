// page/live/components/liveBottom/liveBottom.js
Component({
  properties: {
    close: {
      type: Boolean,
      value: 1
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
    wx.onKeyboardHeightChange(res => {
      console.log(res.height)
      this.setData({
        keyHeight: res.height
      }, () => {
        this.data.keyHeight == 0 && !this.data.focus ? this.setData({
          keyHeight: '-60'
        }) : ''
      })
    })
    this.praiseNum = 0
  },
  data: {
    focus: false,
    keyHeight: '-500',
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
      })
    },
    send() {
      this.triggerEvent('sendMsg', this.data.txt)
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
    }
  }
})