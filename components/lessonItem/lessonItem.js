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
    toLesson(e) {
      let item = e.currentTarget.dataset.item
      if(item.type == 1 || item.columnId) {
        if(item.columnId) {
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
      let item = e.currentTarget.dataset.item
      this.triggerEvent('addStudy', item)
    }
  }
})
