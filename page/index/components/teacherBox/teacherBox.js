const { detail } = require("../../../../data/Circle");

// page/index/components/teacherBox/teacherBox.js
Component({
  properties: {
    item: {
      type: JSON,
      value: {}
    },
    index: {
      type: Number,
      value: 0
    },
    isSearch: {
      type: Boolean,
      value: false
    }
  },
  data: {

  },
  methods: {
    checkAttention(e) {
      let page = getCurrentPages()[getCurrentPages().length - 1]
      page.checkAttention(e)
    },
    checknextTap(e) {
      getApp().checknextTap(e)
    },
    toDetail(e) {
      let uid = e.currentTarget.dataset.uid
      wx.navigateTo({
        url: '/page/index/pages/tearcherDetail/tearcherDetail?id=' + uid,
      })
    },
  }
})
