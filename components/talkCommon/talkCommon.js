const Tutor = require("../../data/Tutor")

// components/talkCommon/talkCommon.js
Component({
  properties: {
    talkList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        // 属性值变化时执行
        if (newVal.length == 0) return
        if (newVal.length > oldVal.length) {
          !this.touch || !this.data.showNum ? this.toBottom() : ''
          if (this.data.showNum) {
            this.triggerEvent('setNewmessagenum', {
              num: newVal.length - oldVal.length,
              type: 1
            })
          }
        }
      }
    },
    specialList: {
      type: Array,
      value: [],
    },
    joinList: {
      type: Array,
      value: [],
    },
    newMessage: {
      type: Number,
      value: 0
    },
    close: {
      type: Boolean,
      value: 0
    },
    showList: {
      type: Boolean,
      value: 1
    },
    vliveRoom: {
      type: Boolean,
      value: 0
    },
    statusBarHeight: {
      type: Number,
      value: 30
    }
  },
  data: {
    scrollTop: 99999999999999999,
    inScroll: 1,
    showNum: 0,
    top: 0,
    show: true,
    joinSpelItem: true
  },
  ready() {
    this.toBottom()
    this.touch = 0
    this.timer = null
  },
  methods: {
    toBottom() {
      this.setData({
        scrollTop: this.data.scrollTop,
        inScroll: 0,
      })
    },
    niewMore() {
      this.setData({
        scrollTop: 99999999999999999,
        inScroll: 0,
        showNum: 0
      })
      this.triggerEvent('setNewmessagenum', {
        num: 0
      })
    },
    bindscroll(e) {
      this.data.inScroll ? [
          this.setData({
            showNum: e.detail.scrollHeight - e.detail.scrollTop <= 255 ? 0 : 1
          }),
          this.setCrollTop(e.detail.scrollTop, e.detail.scrollHeight)
        ] :
        this.setData({
          inScroll: 1
        })
    },
    setCrollTop(scrollTop, scrollHeight) {
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (scrollHeight - scrollTop <= 255) {
          this.touch = 0
          return
        }
        this.setData({
          scrollTop: this.data.showNum ? scrollTop : 999999999999999
        }, () => {
          this.touch = 0
        })
      }, 800);
    },
    touchstart() {
      this.touch = 1
    },
    bindscrolltolower() {
      this.niewMore()
      this.triggerEvent('setNewmessagenum', {
        num: 0
      })
    },
    animationiteration() {
      this.triggerEvent('animationEnd')
      this.setData({
        joinSpelItem: false
      }, () => {
        setTimeout(() => {
          this.setData({
            joinSpelItem: true
          })
        }, 500)
      })
    },
    afterEnter(e) {
      let index = e.currentTarget.dataset.index,
        num = this.data.specialList[index].num
      this.timeShow(index, num)
    },
    afterLeave(e) {
      let index = e.currentTarget.dataset.index
      this.triggerEvent('animationDel', {
        index
      })
    },
    timeShow(index, num) {
      var timer = setTimeout(() => {
        if(!this.data.specialList[index]) return
        this.data.specialList[index].num == num ? [this.triggerEvent('animationCheck', {
          index
        }), clearTimeout(timer)] : [clearTimeout(timer), this.timeShow(index, this.data.specialList[index].num)]
      }, 1000)
    }
  }
})