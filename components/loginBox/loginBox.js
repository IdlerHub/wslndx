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
    show() {
      this.triggerEvent('nextTap')
    }
  }
})
