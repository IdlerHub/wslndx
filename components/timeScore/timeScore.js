// components/timeScore/timeScore.js
Component({
  properties: {
    detail: {
      type: Object,
      value: {}
    },
    isOn: {
      type: Boolean,
      value: {}
    },
    inro: {
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
  },
  methods: {
    onChange(e) {
      this.setData({
        timeData: e.detail,
        value: this.data.value += 1
      });
    },
  }
})
