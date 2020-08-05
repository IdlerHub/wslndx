// page/live/components/liveLesson/liveLesson.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lessons: {
      type: Object,
      value: {},
    },
  },
  data: {
    weeks: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  },

  methods: {
    toDetail(e) {
      console.log(e);
      let { lessonId, own } = e.currentTarget.dataset;
      let url = "/page/live/pages/tableDetail/tableDetail?lessonId=" + lessonId;
      if (own) {
        url = "/page/live/pages/liveDetail/liveDetail?lessonId=" + lessonId;
      }
      wx.navigateTo({
        url
      });
    },
  },
});
