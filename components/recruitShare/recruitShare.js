// components/recruitShare/recruitShare.js
Component({
  properties: {
    type: {
      type: Boolean,
      value: true
    },
  },
  methods: {
    checknextTap(e) {
      getApp().changeLoginstatus()
    },
  }
})