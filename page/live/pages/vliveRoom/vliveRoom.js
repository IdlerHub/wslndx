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
    liveCount: 0,
    newMessage: 0,
    praiseCount: 0,
    showCanvans: 1
  },
  onLoad: function (ops) {
    this.liveOps = ops
    this.liveInit()
  },
  onShow: function () {
    this.setData({
      showCanvans: 1
    })
  },
  onHide: function () {
    this.setData({
      showCanvans: 0
    })
  },
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
        liveCount: res.data.popularity
      })
    })
  },
  addliveCount() {
    this.setData({
      liveCount: this.data.liveCount += 1
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
  },
  setNewmessagenum(e) {
    e.detail.type ?
      this.setData({
        newMessage: e.detail.num + this.data.newMessage
      }) : this.setData({
        newMessage: e.detail.num
      })
  },
  clickHandler() {
    this.setData({
      praiseCount: this.data.praiseCount += 1
    });
  },
  bindstatechange(e) {
    console.log(e)
  }
})