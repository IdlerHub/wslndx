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
    text: '',
    lessList: [{
        add_id: 0,
        big_image: "",
        browse: 62197,
        category_id: 21,
        collection: 64120,
        createtime: 1552911670,
        current_sublesson_id: 0,
        duration: 2,
        edit_id: 0,
        film_length_all: 603,
        honor: null,
        id: 123,
        image: "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/3121797d90955e4eb9a8bc6fac575455.jpg",
        intro: null,
        intro_content: "<p>游有所学，精思善疑</p>",
        lesson_count: 5,
        name: null,
        province: 0,
        rec_status: 0,
        remarks: "",
        settop: 0,
        share: 0,
        show_big: 0,
        status: 1,
        subtitle: "游有所学，精思善疑",
        teacher_id: 0,
        title: "孔子游学",
        weigh: null
      },
      {
        add_id: 0,
        big_image: "",
        browse: 65446,
        category_id: 21,
        collection: 61230,
        createtime: 1552910916,
        current_sublesson_id: 0,
        duration: 2,
        edit_id: 0,
        film_length_all: 730,
        honor: null,
        id: 121,
        image: "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/246bb5fc204c57f2becc8809a0ab9beb.jpg",
        intro: null,
        intro_content: "<p>历史中存在太多静等着我们去发现的文化</p>",
        lesson_count: 60,
        name: null,
        province: 0,
        rec_status: 0,
        remarks: "",
        settop: 0,
        share: 0,
        show_big: 0,
        status: 1,
        subtitle: "历史中存在太多静等着我们去发现的文化",
        teacher_id: 0,
        title: "文史江湖",
        weigh: null
      }
    ]
  },
  onLoad: function(options) {
    this.initRecord()
    this.param = {
      page: 1,
      pageSize: 10
    }
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
      let filePath = res.tempFilePath
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
      app.circle
        .upload(filePath, 2)
        .then(msg => {
          msg = JSON.parse(msg)
          console.log(msg)
          if (msg.code == 1) {
            this.setData({
              "param.video": msg.data.url,
              "param.cover": msg.data.cover,
              "param.asset_id": msg.data.asset_id,
              media_type: type
            })
            this.judge()
          } else {
            wx.showToast({
              title: ms.msg,
              icon: "none",
              duration: 1500
            })
          }
        })
        .catch(err => {
          wx.showToast({
            title: "上传失败！",
            icon: "none",
            duration: 1500
          })
        })
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
    this.setData({
      text: e.detail.value
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