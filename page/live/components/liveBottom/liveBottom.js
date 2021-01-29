const Tutor = require("../../../../data/Tutor")

// page/live/components/liveBottom/liveBottom.js
Component({
  properties: {
    close: {
      type: Boolean,
      value: 1
    },
    vliveRoom: {
      type: Boolean,
      value: 0
    },
    columnId: {
      type: Number,
      value: 0
    },
    keyHeight: {
      type: String || Number,
      value: '-60'
    }
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: () => {

    },
  },
  ready() {
    this.giftListConfig()
    let systemInfo = wx.getSystemInfoSync()
    this.setData({
      system: systemInfo.platform
    })
    this.praiseNum = 0
    this.roomPages = getCurrentPages()[getCurrentPages().length - 1]
  },
  data: {
    focus: false,
    keyHeight: '-60',
    txt: '',
    system: 'ios',
    praiseCount: 0,
    popupShow: false,
    activeNum: 0,
    giftList: []
  },
  methods: {
    giftListConfig: async function() {
       let list = (await getApp().liveData.giftListConfig()).dataList
       this.setData({
         giftList: list
       })
    },
    showBox() {
      this.setData({
        focus: !this.data.focus
      })
    },
    bindinput(e) {
      this.setData({
        txt: e.detail.value
      }, () => {
        this.data.txt.length >= 50 ? wx.showToast({
          title: '内容仅限50字哦',
          icon: 'none'
        }) : ''
      })
    },
    send() {
      this.triggerEvent('sendMsg', this.data.txt)
      this.setData({
        txt: ''
      }, () => {
        getCurrentPages().forEach(e => {
          if (e.pageName == 'live') {
            e.selectComponent('#talkCommon').niewMore()
          }
        })
      })
    },
    praise() {
      this.praiseNum += 1
      this.timer ? clearTimeout(this.timer) : ''
      this.timer = setTimeout(() => {
        console.log(this.praiseNum)
        this.triggerEvent('praise', this.praiseNum)
        this.praiseNum = 0
      }, 1000);
    },
    clickHandler() {
      this.triggerEvent('clickHandler')
      // this.setData({
      //   praiseCount: this.data.praiseCount += 1
      // })
    },
    checkCaption() {
      this.triggerEvent('checkCaption')
    },
    toLessons() {
      let pages = getCurrentPages(),
        back = 0
      pages.forEach(e => {
        e.pageName ? e.pageName == 'liveDetail' ? back = 1 : '' : ''
        e.pagetype ? back = 2 : ''
      })
      back ? wx.navigateBack({
        delta: back
      }) : wx.navigateTo({
        url: '/page/live/pages/liveDetail/liveDetail?specialColumnId=' + this.data.columnId,
      })
    },
    showGift() {
      this.setData({
        popupShow: !this.data.popupShow
      })
    },
    checkGift(e) {
      let index =  e.currentTarget.dataset.index
      this.setData({
        activeNum: index
      })
    }
  }
})