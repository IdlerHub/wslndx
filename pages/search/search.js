// pages/search/search.js
const app = getApp()
const plugin = requirePlugin("WechatSI")
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()

const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    voiceImg: 'https://hwcdn.jinlingkeji.cn/images/pro/voicebtn.png',
    voiceActon: false,
    voiceheight: '',
    focus: true,
    text: '',
    lessList: [],
    showqst: false,
    showvioce: true
  },
  onLoad: function(options) {
    this.param = {
      page_size: 10
    }
    this.voiceheight = 0
    wx.onKeyboardHeightChange(res => {
      console.log(res.height)
      let systems = wx.getSystemInfoSync()
      this.voiceheight == 0 ? this.voiceheight = res.height : ''
      this.voiceheight != 0 ? res.height == 0 ? '' :this.setData({
        voiceheight: this.voiceheight + (systems.screenHeight * 0.05),
        showvioce: true,
        showqst: false
      }) : ''
    })
  },
  onShow() {
    this.getRecordAuth()
    this.initRecord()
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
    this.lesssearch(true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  detailTap: function (e) {
    let title = e.currentTarget.dataset.item.title.replace('<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">', '').replace('</p>', '').replace('<span style="color:#DF2020">', '').replace('</span>', '')
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.item.id}&name=${title}`
    })
    //用于数据统计
    app.aldstat.sendEvent("搜索课程点击", {
      name: e.currentTarget.dataset.item.title
    })
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
      let text = this.data.text + res.result.replace('。', '').replace('，', '')
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
      this.param = {
        page_size:10
      }
      this.lesssearch()
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
      voiceImg: 'https://hwcdn.jinlingkeji.cn/images/pro/voicebtnr.png',
      voiceActon: true
    })
  },
  touchend() {
    manager.stop()
    this.setData({
      voiceImg: 'https://hwcdn.jinlingkeji.cn/images/pro/voicebtn.png',
      voiceActon: false
    })
  },
  keychange(e) {
    let systems = wx.getSystemInfoSync()
    // wx.onKeyboardHeightChange(res => {
    //   console.log(res.height)
    //   res.height != 0 ? this.setData({
    //     voiceheight: res.heightt + (systems.screenHeight * 0.05)
    //   }) : ''
    // })   
  },
  txtchange(e) {
    this.setData({
      text: e.detail.value
    })
    e.detail.value.length == 0 ? this.setData({
      lessList: []
    }) : ''
  },
  cleartxt() {
    this.setData({
      text: '',
      focus: false,
      lessList:[]
    })
    this.setData({
      focus: true
    })
  },
  earchlesss(){
    this.param = {
      page_size:10
    }
    this.lesssearch()
  },
  lesssearch(list) {
    this.param['keyword'] = this.data.text
    let lesslist =  []
    list ? lesslist = this.data.lessList : ''
    app.classroom.lessSearch(this.param).then(res => {
      if (res.code == 1) {
        if (!res.data.data) {
          this.setData({
            showqst: true,
            showvioce: false,
            voiceActon: false
          })
          return
        }
        let lessList = res.data.data
        this.param['scroll_id'] = res.data.scroll_id,
        lessList.forEach(item => {
          item.title = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.title.replace(/<highlight>/g, '<span style="color:#DF2020">').replace(/<\/highlight>/g, '</span>')}</p>`
          item.subtitle = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.subtitle.replace(/<highlight>/g, '<span style="color:#DF2020">').replace(/<\/highlight>/g, '</span>')}</p>`
          item.bw = app.util.tow(item.browse)
        })
        lesslist.push(...lessList)
        this.setData({
          showvioce: false,
          lessList: lesslist,
          voiceActon: false
        })
      }
    })
  }
})