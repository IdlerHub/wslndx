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
      let page = getCurrentPages()[getCurrentPages().length - 1]
      switch (this.data.$state.nextTapDetial.type) {
        case 'top':
          page.toInfo()
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
          page.bannerGo(this.data.$state.nextTapDetial.detail)
          break;
        case 'live':
          page.toLivelesson(this.data.$state.nextTapDetial.detail)
          break;
        case 'lesson':
          page.selectComponent('#lessonItem').toLesson(this.data.$state.nextTapDetial.detail)
          break;
        case 'addStudy':
          page.selectComponent('#lessonItem').addStudy(this.data.$state.nextTapDetial.detail)
          break;
        case 'navBar':
          wx.switchTab({
            url: this.data.$state.nextTapDetial.detail,
          })
          break;
      }
    }
  }
})