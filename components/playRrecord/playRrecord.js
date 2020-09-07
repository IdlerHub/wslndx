// components/playRrecord/playRrecord.js
const app = getApp()
const record = require("../../utils/record")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: JSON,
      value: {}
    },
    playVoice: {
      type: JSON,
      value: {
        status: 0,
        playTimer: {
          minute: 0,
          second: 0
        },
        id: 0
      }
    },
    showDel: {
      type: Boolean,
      value: 0
    }
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
    },
    hide: function () {
      console.log('页面隐藏')
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    playVoice(e) {
      let pages = getCurrentPages()
      record.checkRecord(e, pages[pages.length - 1])
      console.log(this.data.playVoice)
    },
    delRecord() {
      let pages = getCurrentPages()
      pages[pages.length - 1].delRecord(pages[pages.length - 1])
    }
  }
})