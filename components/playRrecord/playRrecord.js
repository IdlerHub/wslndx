
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
    currentTab: {
      type: String,
      value: ""
    }
  },
  observers:{
    "currentTab": function (currentTab) {
      if(currentTab == this.data.current) {
        this.setData({
          playRecord: 0,
          current: currentTab
        })
        innerAudioContext.stop();
      } 
    }
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
        this.playTiemr ? clearInterval(this.playTiemr) : ''
        this.playTiemr = setInterval(() => {
          if (this.data.playTiemr.minute == this.data.timer.minute && this.data.playTiemr.second == this.data.timer.second) {
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
        console.log(4324324324)
        this.playTiemr ? clearInterval(this.playTiemr) : ''
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
        this.setData({
          playRecord: 1,
          voiceplayimg: 'https://hwcdn.jinlingkeji.cn/images/pro/voicepause.png'
        })
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