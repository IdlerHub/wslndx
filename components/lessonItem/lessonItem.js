const Tutor = require("../../data/Tutor")

// components/lessonItem/lessonItem.js
Component({
  properties: {
    lessonList: {
      type: Array,
      value: []
    },
    isSchool: {
      type: Boolean,
      value: false
    },
    isIndex: {
      type: Boolean,
      value: false
    }
  },
  data: {

  },
  methods: {
    loginStatus(e) {
      if (!this.data.$state.userInfo.id) {
        getApp().changeLoginstatus()
        getApp().checknextTap(e)
        return true
      }
    },
    toLesson(e) {
      let item = e.currentTarget.dataset.item
      if (item.type == 1 || item.columnId) {
        if (item.columnId) {
          item.isEnroll ? wx.navigateTo({
            url: '/page/live/pages/liveDetail/liveDetail?specialColumnId=' + item.columnId,
          }) : wx.navigateTo({
            url: '/page/live/pages/tableDetail/tableDetail?specialColumnId=' + item.columnId,
          })
          return
        }
        wx.navigateTo({
          url: '/page/live/pages/liveDetail/liveDetail?specialColumnId=' + item.id,
        })
      } else {
        wx.navigateTo({
          url: '/page/index/pages/detail/detail?id=' + item.id,
        })
      }
    },
    addStudy(e) {
      if(this.loginStatus(e)) return
      let item = e.currentTarget.dataset.item
      this.triggerEvent('addStudy', item)
    }
  }
})