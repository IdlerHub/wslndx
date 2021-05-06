// components/slotSign/slotSign.js
Component({
  properties: {

  },
  data: {

  },
  methods: {
    changeLoginstatus() {
      console.log(this.data.$state.userInfo.id)
      if(this.data.$state.userInfo.id) return
      getApp().changeLoginstatus()
    }
  }
})
