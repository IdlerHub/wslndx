// components/slotSign/slotSign.js
Component({
  properties: {

  },
  data: {

  },
  methods: {
    changeLoginstatus() {
      if(this.data.$state.userInfo.id) return
      getApp().changeLoginstatus()
    }
  }
})
