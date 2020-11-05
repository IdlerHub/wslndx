// components/talkCommon/talkCommon.js
Component({
  properties: {
    talkList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        // 属性值变化时执行
        if (newVal.length == 0) return
        console.log(newVal)
        if (newVal.length > oldVal.length) {
          this.toBottom()
        }
      }
    }
  },
  data: {
    scrollTop: 99999999999999999,
    inScroll: 1
  },
  ready() {
    this.toBottom()
  },
  methods: {
    toBottom() {
      this.setData({
        scrollTop: this.data.scrollTop,
        inScroll: 0
      })
    },
    bindscroll(e) {
      this.data.inScroll ?
        this.setData({
          scrollTop: e.detail.scrollTop
        }) :
        this.setData({
          inScroll: 1
        })
    }
  }
})