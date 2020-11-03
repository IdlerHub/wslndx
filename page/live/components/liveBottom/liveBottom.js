// page/live/components/liveBottom/liveBottom.js
Component({
  properties: {
    system: {
      type: String,
      value: 'ios'
    }
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: () => {

    },
  },
  ready() {
    wx.onKeyboardHeightChange(res => {
      console.log(res.height)
      this.setData({
        keyHeight: res.height
      }, () => {
        this.data.keyHeight == 0 ? this.setData({
          keyHeight: '-100'
        }) : ''
      })
    })
  },
  data: {
    showBox: 0,
    focus: false,
    keyHeight: '-100',
  },
  methods: {
    showBox() {
      this.setData({
        showBox: !this.data.showBox
      })
    }
  }
})