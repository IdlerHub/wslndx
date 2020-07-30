
// components/playRrecord/playRrecord.js
const innerAudioContext = wx.createInnerAudioContext();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    duration: {
      type: Number,
      value: 0
    },
    recordUrl: {
      type: String,
      value: ''
    },
    playDuration: {
      type: Number,
      value: 0
    }
  },
  observers:{
  },
  /**
   * 组件的初始数据
   */
  data: {
    voiceplayimg: 'https://hwcdn.jinlingkeji.cn/images/pro/triangle.png',
    playRecord: 0,
    timer: {
      second: 0,
      minute: 0
    },
    playTiemr: {
      second: 0,
      minute: 0
    },
    interTimer: {
      second: 0,
      minute: 0
    },
    current:0
  },

  lifetimes: {
    attached: function () { 
      this.initRecord()
      this.tiemrInit()
      this.setData({
        current: this.data.currentTab
      })
    },
    detached: function () {
      console.log('组件销毁')
      innerAudioContext.stop();
    }
  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
    },
    hide: function() {
      console.log('页面隐藏')
      innerAudioContext.stop();
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initRecord() {
      innerAudioContext.onPlay(() => {
        this.setData({
          'playTiemr.minute': 0,
          'playTiemr.second': 0
        })
        this.playTiemr ? [clearInterval(this.playTiemr), this.playTiemr= null ] : ''
        this.playTiemr = setInterval(() => {
          console.log(this.data.playTiemr.minute, this.data.interTimer.minute , this.data.playTiemr.second, this.data.interTimer.second)
          if (this.data.playTiemr.minute == this.data.interTimer.minute && this.data.playTiemr.second == this.data.interTimer.second) {
            innerAudioContext.stop()
            return
          }
          let num = this.data.playTiemr.second
          num += 1
          num > 60 ? this.setData({
            'playTiemr.minute': this.data.playTiemr.minute += 1,
            'playTiemr.second': 0
          }) : this.setData({
            'playTiemr.second': num
          })
        }, 1000)
      })
  
      innerAudioContext.onStop(() => {
        this.playTiemr ? [clearInterval(this.playTiemr), this.playTiemr= null]  : ''
        this.setData({
          playRecord: 0,
          voiceplayimg: 'https://hwcdn.jinlingkeji.cn/images/pro/triangle.png'
        })
      })
    },
    tiemrInit() {
      this.setData({
        'timer.minute': parseInt(this.data.duration/60),
        'timer.second': this.data.duration - (parseInt(this.data.duration/60) * 60)
      })
    },
    playVoice() {
      if (!this.data.playRecord) {
        console.log(324234234234)
        this.setData({
          playRecord: 1,
          voiceplayimg: 'https://hwcdn.jinlingkeji.cn/images/pro/voicepause.png',
          'interTimer.minute': parseInt(this.data.playDuration/60),
          'interTimer.second': this.data.playDuration - (parseInt(this.data.playDuration/60) * 60)
        })
        console.log(this.data.interTimer, this.data.playDuration, this.data.recordUrl)
        innerAudioContext.src = this.data.recordUrl;
        innerAudioContext.play();
      } else {
        this.setData({
          playRecord: 0
        })
        innerAudioContext.stop();
      }
    },
  }
})