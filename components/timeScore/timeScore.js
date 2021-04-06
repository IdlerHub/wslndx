// components/timeScore/timeScore.js
const app = getApp()
Component({
  properties: {
    detail: {
      type: Object,
      value: {},
    },
    isOn: {
      type: Boolean,
      value: {}
    },
    inro: {
      type: Object,
      value: {}
    },
    lessonDetail: {
      type: Object,
      value: {}
    }
  },
  data: {
    time: 30 * 1000,
    timeData: {},
    value: 0
  },
  ready() {
    this.timeScore = this.selectComponent('.control-count-down')
    this.addStudy = false
    setTimeout(() => {
      this.addStudyRecord()
    }, 1000)
  },
  methods: {
    onChange(e) {
      this.setData({
        timeData: e.detail,
        value: this.data.value += 1
      }, () => {
        if (this.data.timeData.seconds == 0 && !this.addStudy) {
          this.addStudy = true
          app.activity.addStudyRecord({
            optType: 2,
            channelId: this.data.detail.id || this.data.inro.id || this.data.lessonDetail.hallSpecialColumnId,
            channelType: JSON.stringify(this.data.lessonDetail) == "{}" ? (JSON.stringify(this.data.detail) == '{}' ? 3 : 1) : 2
          })
        }
      });
    },
    addStudyRecord() {
      console.log()
      if (this.data.inro.studyScore > 0 || this.data.inro.studyScore > 0 || this.data.lessonDetail.studyScore > 0) return
      app.activity.addStudyRecord({
        optType: 1,
        channelId: JSON.stringify(this.data.lessonDetail) == "{}" ? (this.data.isOn ? this.data.inro.id : this.data.detail.id) : this.data.lessonDetail.hallSpecialColumnId,
        channelType: JSON.stringify(this.data.lessonDetail) == "{}" ? (this.data.isOn ? 3 : 1) : 2
      })
    },
  }
})