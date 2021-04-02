// page/discoveryHall/pages/detail/detail.js
const app = getApp()
Page({
  data: {
    statusBarHeight: 30,
    detail: {}
  },
  onLoad: function (options) {
    this.setData({
      statusBarHeight: wx.getSystemInfoSync().statusBarHeight + 12
    })
    options.isOn ? this.setData({
      isOn: 1
    }) : this.hallGetOpusInfo(options.id)
    this.videoContext = wx.createVideoContext("myVideo");
  },
  onShareAppMessage: function (ops) {
    if (ops.from === "menu") {
      return this.menuAppShare();
    }
    if (ops.from === "button") {
      return {
        title: '视频详情',
        imageUrl: "/images/sharemessage.jpg",
        path: "/page/discoveryHall/pages/videoDetail/videoDetail?id=" +
          this.data.detail.id +
          "&type=share&uid=" +
          this.data.$state.userInfo.id
      };
    }
  },
  hallGetOpusInfo(opusId) {
    app.activity.hallGetOpusInfo({
      opusId
    }).then(res => {
      this.setData({
        detail: res.data
      }, () => {
        this.videoContext.play()
      })
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
    app.activity.giveOrCancelLike({
      channelId: this.data.detail.id,
      channelType: this.data.detail.isOn ? 3 : 1,
      isLike: 1
    }).then(() => {
      this.setData({
        'detail.isLike': 1
      })
    })

  }
})