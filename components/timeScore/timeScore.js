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
  methods: {
    onChange(e) {
      this.setData({
        timeData: e.detail,
        value: this.data.value += 1
      });
    },
  }
})
