// components/loginBox/loginBox.js
Component({
  properties: {

  },
  data: {
    check: true,
    phoneLogin: false
  },
  methods: {
    checkRadio() {
      this.setData({
        check: !this.data.check
      })
    },
    getphonenumber(e) {
      console.log(e)
    },
    changeLoginstatus() {
      getApp().changeLoginstatus()
    },
    nextTap() {
      switch (this.data.$state.nextTapDetial.type) {
        case 'top':
          this.toInfo()
          break;
        case 'search':
          wx.navigateTo({
            url: this.data.$state.nextTapDetial.detail,
          })
          break;
        case 'myLesson':
          wx.navigateTo({
            url: this.data.$state.nextTapDetial.detail,
          })
          break;
        case 'swiper':
          this.bannerGo(this.data.$state.nextTapDetial.detail)
          break;
        case 'live':
          this.toLivelesson(this.data.$state.nextTapDetial.detail)
          break;
        case 'lesson':
          this.selectComponent('#lessonItem').toLesson(this.data.$state.nextTapDetial.detail)
          break;
        case 'addStudy':
          this.selectComponent('#lessonItem').addStudy(this.data.$state.nextTapDetial.detail)
          break;
      }
    }
  }
})
