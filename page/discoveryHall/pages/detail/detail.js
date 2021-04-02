// page/discoveryHall/pages/detail/detail.js
var htmlparser = require("../../../../utils/htmlparser");
const app = getApp()
Page({
  data: {
    statusBarHeight: 30,
    detail: {},
    isPlay: true,
    showMoreTxt: false,
    showMore: false,
    isOn: false
  },
  onLoad: function (options) {
    this.setData({
      statusBarHeight: wx.getSystemInfoSync().statusBarHeight + 12
    })
    options.isOn ? [this.setData({
      isOn: 1
    }), this.hallGgetContentInfo()] : this.hallGetOpusInfo(options.id)
    this.videoContext = wx.createVideoContext("myVideo");
  },
  onShareAppMessage: function (ops) {
    if (ops.from === "menu") {
      return this.menuAppShare();
    }
    if (ops.from === "button") {
      app.activity.experienceHallShare({
        channelId: this.data.isOn ? this.data.inro.id : this.data.detail.id,
        channelType: this.data.isOn ? 3 : 1
      })
      let path = !this.data.isOn ? "/page/discoveryHall/pages/detail/detail?id=" +
        this.data.detail.id : "/page/discoveryHall/pages/detail/detail?isOn=1"
      return {
        title: this.data.isOn ? '关于网上老年大学' : this.data.detail.title,
        imageUrl: this.data.isOn ? this.data.inro.coverImage : this.data.detail.coverImage,
        path: path +
          "&type=share&uid=" +
          this.data.$state.userInfo.id
      };
    }
  },
  hallGetOpusInfo(opusId) {
    app.activity.hallGetOpusInfo({
      opusId
    }).then(res => {
      res.data.type == 2 ? res.data.content = htmlparser.default(res.data.content) : null
      this.setData({
        detail: res.data
      }, () => {
        if (res.data.type == 2) return
        this.videoContext.play()
        let query = wx.createSelectorQuery().in(this),
          that = this
        query.selectAll(".videoContent").boundingClientRect()
        query.exec(res => {
          (res[0][0].height + 8) < res[0][1].height ? this.setData({
            showMoreTxt: true
          }) : null
        })
      })
    })
  },
  hallGgetContentInfo() {
    app.activity.hallGgetContentInfo().then(res => {
      this.setData({
        inro: res.data
      }, () => {
        this.videoContext.play()
      })
    })
  },
  pause() {
    this.data.isPlay ? this.videoContext.pause() : this.videoContext.play()
    this.setData({
      isPlay: !this.data.isPlay
    })
  },
  toBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
    } else {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  },
  praise() {
    if (this.data.detail.isLike) return
    app.activity.giveOrCancelLike({
      channelId: this.data.isOn ? this.data.inro.id : this.data.detail.id,
      channelType: this.data.isOn ? 3 : 1,
      isLike: 1
    }).then(() => {
      this.setData({
        'detail.isLike': 1
      })
    })

  },
  checkMore() {
    this.setData({
      showMore: !this.data.showMore
    })
  }
})