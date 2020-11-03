// components/talkCommon/talkCommon.js
Component({
  properties: {
    talkList: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal) {
        // 属性值变化时执行
        if(newVal.length == 0) return
        console.log(newVal)
        if(newVal.length > oldVal.length) {
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
