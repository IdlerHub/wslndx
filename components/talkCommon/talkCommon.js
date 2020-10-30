// components/talkCommon/talkCommon.js
Component({
  properties: {
    talkList: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal) {
        // 属性值变化时执行
        if(newVal.length == 0) return
        if(newVal[0].name == oldVal[0].name && newVal[0].content == oldVal[0].content) {
          this.toBottom()
        }
      }
    }
  },
  data: {
    scrollTop: 0
  },
  ready() {
    this.toBottom()
  },
  methods: {
    toBottom() {
      this.setData({
        scrollTop: 99999999999999999
      })
    }
  }
})
