// page/live/pages/liveCertificate/liveCertificate.js
const app = getApp();
const qr = require("../../utils/qrcode.js")
Page({
  data: {
    detail: {},
    src: '',
    canvans: {},
    info: {},
    qrUrl: ''
  },
  onLoad: function (ops) {
    wx.showLoading({
      title: '努力生成证书中',
    })
    let detail = {
      nick: this.data.$state.userInfo.name || this.data.$state.userInfo.nickname,
      name: ops.name,
      columnId: ops.id
    }
    this.setData({
      detail
    }, () => {
      this.getDetail()
    })
  },
  onShow: function () {},
  onUnload() {
    wx.hideLoading()
  },
  getDetail() {
    app.study.certificateiInfo({
      columnId: this.data.detail.columnId
    }).then(res => {
      this.setData({
        info: res.data
      }, () => {
        this.qrInit()
      })
    })
  },
  qrInit() {
    let qrcodeText = this.data.info.qrUrl; //二维码内容
    new qr('myQrcode', {
      text: qrcodeText,
      width: 180,
      height: 180,
      colorLight: "#FFE8D3",
      correctLevel: qr.CorrectLevel.H, // 二维码可辨识度
      callback: (res) => {
        this.setData({
          qrUrl: res.path
        }, () => {
          this.initCanvans()
        })
      }
    })
  },
  rpxToPx(data) {
    return data / 750 * wx.getSystemInfoSync().windowWidth
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
    }, () => {
      let that = this
      wx.saveFile({
        tempFilePath: e.detail.path,
        success(msg) {
          let savedFilePath = msg.savedFilePath
          wx.hideLoading()
          let res = wx.getStorageSync('certificateImg')
          if (res) {
            res[that.data.info.id] = savedFilePath
            wx.setStorage({
              key: "certificateImg",
              data: res
            })
          } else {
            let certificateImg = {}
            certificateImg[that.data.info.id] = savedFilePath
            wx.setStorage({
              key: "certificateImg",
              data: certificateImg
            })
          }
        }
      })
    })
  },
  initCanvans() {
    let canvans = {
      width: '690rpx',
      height: '1012rpx',
      background: 'https://hwcdn.jinlingkeji.cn/images/pro/certificate1.png',
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
          text: this.data.info.columnName,
          css: {
            top: this.data.info.columnName.length > 10 ? '375rpx' : '369rpx',
            fontSize: this.data.info.columnName.length > 10 ? '25rpx' : '36rpx',
            left: '336rpx',
            align: 'center',
            color: '#3A3A3A'
          }
        },
        {
          type: 'text',
          text: this.data.info.universityName,
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
          text: this.data.info.updatetime,
          css: {
            top: '710rpx',
            left: '84rpx',
            align: 'left',
            fontSize: '30rpx',
            color: '#666666'
          }
        },
        {
          type: 'image',
          url: this.data.qrUrl,
          css: {
            bottom: '208rpx',
            right: '83rpx',
            width: '180rpx',
            height: '180rpx',
          },
        },
        {
          type: 'image',
          url: 'https://hwcdn.jinlingkeji.cn/images/pro/qrIcon.png',
          css: {
            bottom: '272rpx',
            right: '145rpx',
            width: '50rpx',
            height: '50rpx',
          },
        },
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