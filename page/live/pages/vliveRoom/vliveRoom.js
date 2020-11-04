// page/live/pages/liveVideo/liveVideo.js
const app = getApp()
import timsdk from "../../utils/timsdk";
Page({
  data: {
    topT: 28,
    talkList: [],
    close: 0,
    userInfo: {},
    liveDetail: {},
    liveCount: {},
  },
  onLoad: function (ops) {
    this.liveOps = ops
    let talkList = [{
        name: '网上老年大学小助手：',
        content: '欢迎来到直播间：1、请自行调节手机音量至合适的状态。2、听众发言可以在讨论区进行查看。'
      }, {
        name: '李思:  ',
        content: '交互往上消失'
      },
      {
        name: '李思:  ',
        content: '交互往上消失'
      },
      {
        name: '我爱割韭菜:  ',
        content: '好的，等待开始'
      },
      {
        name: '李思:  ',
        content: '老师讲的这个要点非常好！'
      },
      {
        name: '李思:  ',
        content: '分享了课程',
        share: 1
      },
      {
        name: '李思:  ',
        content: '讲得很棒！',
        fromApp: 1
      },
    ]
    this.setData({
      talkList
    })
    this.liveInit()
  },
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {
    timsdk.quitGroup(this)
    timsdk.timLoginout(this)
    wx.offKeyboardHeightChange()
  },
  onShareAppMessage: function () {
    this.setCustommessag('MD5_AUDIENCE_SHARE_LIVE_ROOM')
    return {
      imageUrl: "../../../../images/sharemessage.jpg",
      title: '案件大会的恢复',
      path: "/page/live/pages/liveVideo/liveVideo?id=" +
        123 +
        "&type=share&uid=" +
        this.data.$state.userInfo.id
    };
  },
  liveInit() {
    Promise.all([this.getTimSign(), this.getLiveById(this.liveOps.roomId), this.liveCount()]).then(values => {
      timsdk.timInit(this, values[0])
    })
  },
  getLiveById(liveId) {
    return app.liveData.getLiveById({
      liveId
    }).then(res => {
      this.setData({
        liveDetail: res.data
      })
      return this.data.liveDetail
    })
  },
  getTimSign() {
    return app.liveData.getTimSign({}).then(res => {
      this.setData({
        userInfo: res.data
      })
      return res.data
    })
  },
  liveCount() {
    app.liveData.liveCount({
      liveId: this.liveOps.roomId
    }).then(res => {
      this.setData({
        liveCount: res.data.timToken
      })
    })
  },
  checkCaption() {
    this.setData({
      close: !this.data.close
    })
  },
  sendMsg(e) {
    timsdk.sendTextMsg(e.detail)
  },
  checkFollow() {
    this.setData({
      'liveDetail.follow': 1
    })
    this.setCustommessag('MD5_AUDIENCE_FOLLOW_LIVE_ROOM_ANCHOR')
  },
  setCustommessag(customText, type, values) {
    let params = {
      customText: customText,
      customType: '0',
      isShow: 'show',
      attachContent: type == 'praise' ? values : ''
    }
    timsdk.customParams(params)
  },
  praise(e) {
    this.setCustommessag('MD5_AUDIENCE_PRAISE_ANCHOR', "praise", e.detail)
  }
})