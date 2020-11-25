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
    }
  },
  data: {

  },
  methods: {
    toLesson(e) {
      let item = e.currentTarget.dataset.item
      if(item.type == 1) {
        wx.navigateTo({
          url: '/page/live/pages/liveDetail/liveDetail?specialColumnId=' + item.id,
        })
      } else {
        wx.navigateTo({
          url: '/page/index/pages/detail/detail?id=' + item.id,
        })
      }
    }
  }
})
