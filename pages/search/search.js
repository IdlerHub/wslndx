// pages/search/search.js
const app = getApp()
const plugin = requirePlugin("WechatSI")
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()

const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    voiceImg: 'http://118.89.201.75/images/voicebtn.png',
    voiceActon: false,
    voiceheight: '',
    focus: true,
    text: ''
  },
  onLoad: function(options) {
    this.initRecord()
  },
  onShow() {
    this.getRecordAuth()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 权限询问
  authrecord() {
    this.setData({
      focus: false
    })
    if (this.data.$state.authRecordfail) {
      wx.showModal({
        content: '您已拒绝授权使用麦克风录音权限，请打开获取麦克风授权！否则无法使用小程序部分功能',
        confirmText: '去授权',
        confirmColor: "#df2020",
        success: res => {
          if (res.confirm) {
            wx.openSetting({})
          }
        }
      })
    }
    if (!this.data.$state.authRecord) {
      wx.authorize({
        scope: 'scope.record',
        success() {
          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
          console.log("succ auth")
          app.store.setState({
            authRecord: true
          })
        },
        fail() {
          console.log("fail auth")
          app.store.setState({
            authRecordfail: true
          })
        }
      })
    }
  },
  getRecordAuth: function() {
    wx.getSetting({
      success(res) {
        let record = res.authSetting['scope.record']
        app.store.setState({
          authRecord: record || false,
        })
      },
      fail(res) {
        console.log("fail")
      }
    })
  },
  /**
   * 初始化语音识别回调
   */
  initRecord: function() {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      this.setData({
        newtxt: res.result
      })
    }

    // 识别结束事件
    manager.onStop = (res) => {
      // 取出录音文件识别出来的文字信息
      let text = this.data.text + res.result.replace('。', '')
      // 获取音频文件临时地址
      let duration = res.duration
      if (text == '') {
        this.showRecordEmptyTip()
        return
      }

      if (res.duration < 1000) {
        wx.showToast({
          title: '录音时间过短',
          icon: 'none',
          duration: 2000,
        })
        // util.showTips('录音时间过短')
        return
      }
      this.setData({
        text
      })
    }

    // 识别错误事件
    manager.onError = (res) => {
      this.setData({
        recording: false,
        bottomButtonDisabled: false,
      })
    }
  },
  /**
   * 识别内容为空时的反馈
   */
  showRecordEmptyTip: function() {
    this.setData({
      recording: false,
      // bottomButtonDisabled: false,
    })
    wx.showToast({
      title: "未识别到语音",
      icon: 'none',
      image: '../../images/no_voice.png',
      duration: 1500,
      success: function(res) {

      },
      fail: function(res) {
        console.log(res);
      }
    });
  },
  backhome() {
    wx.navigateBack()
  },
  touchstart(e) {
    manager.start({
      lang: "zh_CN",
    })
    this.setData({
      voiceImg: 'http://118.89.201.75/images/voicebtnr.png',
      voiceActon: true,
      focus: false
    })
  },
  touchend() {
    manager.stop()
    this.setData({
      voiceImg: 'http://118.89.201.75/images/voicebtn.png',
      voiceActon: false,
      focus: true
    })
  },
  keychange(e) {
    let systems = wx.getSystemInfoSync()
    e.detail.height == 0 ? '' : this.setData({
      voiceheight: e.detail.height + (systems.screenHeight * 0.05)
    })
  },
  txtchange(e) {
    console.log(e.detail.value)
    this.data.text == '' ? this.setData({
      text: e.detail.value
    }) : this.setData({
      text: this.data.text + e.detail.value
    })
  },
  cleartxt() {
    this.setData({
      text: '',
      focus: false
    })
    this.setData({
      focus: true
    })
  }
})