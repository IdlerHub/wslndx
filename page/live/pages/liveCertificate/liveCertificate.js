// page/live/pages/liveCertificate/liveCertificate.js
const app = getApp();

Page({
  data: {
    detail: {},
    date: '',
    src: '',
    canvans: {}
  },
  onLoad: function (ops) {
    let detail = {
      nick: this.data.$state.userInfo.name || this.data.$state.userInfo.nickname,
      name: ops.name
    }
    this.setData({
      detail,
      date: app.util.dateUnit()
    },() => {
      this.initCanvans()
    })
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onShareAppMessage: function (ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      return {
        title: "福利！老年大学十万集免费课程在线学习",
        path: "/pages/index/index"
      }
    }
  },
  onImgOK(e) {
    this.setData({
      sharePath: e.detail.path,
      visible: true,
    })
  },
  initCanvans() {
    let canvans = {
      width: '690rpx',
      height: '1012rpx',
      background: 'https://hwcdn.jinlingkeji.cn/images/pro/certificate.png',
      views: [{
          type: 'text',
          text: this.data.detail.nick,
          css: {
            top: this.data.detail.nick.length >= 5 ? this.data.detail.nick.length > 7 ? '290rpx' : '290rpx' : '278rpx',
            fontSize: this.data.detail.nick.length >= 5 ? this.data.detail.nick.length > 7 ? '20rpx' : '30rpx' : '40rpx',
            left: '190rpx',
            align: 'center',
            color: '#3A3A3A'
          },
        },
        {
          type: 'text',
          text: this.data.detail.name,
          css: {
            top: this.data.detail.name.length > 10 ? '375rpx' : '369rpx',
            fontSize: this.data.detail.name.length > 10 ? '25rpx' : '36rpx',
            left: '336rpx',
            align: 'center',
            color: '#3A3A3A'
          }
        },
        {
          type: 'text',
          text: `网上老年大学`,
          css: {
            top: '668rpx',
            left: '84rpx',
            align: 'left',
            fontSize: '30rpx',
            color: '#666666'
          }
        },
        {
          type: 'text',
          text: this.data.date,
          css: {
            top: '710rpx',
            left: '84rpx',
            align: 'left',
            fontSize: '30rpx',
            color: '#666666'
          }
        }
      ]
    }
    this.setData({
      canvans
    })
  },
  // 保存
  save() {
    // 保存图片到系统相册
    let that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.sharePath,
      success() {
        wx.showToast({
          title: "保存成功"
        })
      },
      fail() {
        wx.showToast({
          title: "保存失败"
        })
      }
    })
  },
})