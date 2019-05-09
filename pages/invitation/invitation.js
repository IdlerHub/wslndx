//Page Object
const app = getApp()

Page({
  data: {
    IMG_URL: app.IMG_URL,
    locolurl: "",
    userInfo: null,
    qrcode: null
  },
  param: {
    count: 0,
    lcoalAvatar: null, //用户肖像
    container: null, //canvas容器
    tempImg: null
  },
  //options(Object)
  onLoad: function(options) {
    let user = wx.getStorageSync("userInfo")
    this.setData({
      userInfo: user
    })
    wx.pro.getImageInfo({ src: user.avatar }).then(res => {
      if (res.errMsg == "getImageInfo:ok") {
        this.param.count += 1
        this.param.lcoalAvatar = res.path //将下载下来的地址存起来
        this.param.count == 3 && this.draw()
      }
    })

    app.user.userQr().then(res => {
      wx.pro.getImageInfo({ src: res.data }).then(res => {
        if (res.errMsg == "getImageInfo:ok") {
          this.param.count += 1
          this.setData({
            qrcode: res.path //将下载下来的地址存起来
          })
          this.param.count == 3 && this.draw()
        }
      })
    })

    let that = this
    wx.createSelectorQuery()
      .in(this)
      .select(".cav")
      .boundingClientRect(rect => {
        that.param.count += 1
        that.param.container = rect
        that.param.count == 3 && that.draw()
      })
      .exec()
  },
  draw: function() {
    let ctx = wx.createCanvasContext("canva_invite", this)
    let ratio = wx.getSystemInfoSync().pixelRatio / 4
    ctx.drawImage("../../images/invitation.png", 0, 0, this.param.container.width * 2 * ratio, this.param.container.height * 2 * ratio)
    ctx.save()
    ctx.beginPath()
    ctx.arc(85 * ratio, 410 * ratio, 35 * ratio, 0, Math.PI * 2, false)
    ctx.clip()
    ctx.drawImage(this.param.lcoalAvatar, 50 * ratio, 375 * ratio, 70 * ratio, 70 * ratio)
    ctx.restore()
    ctx.setFillStyle("white")
    ctx.setFontSize(36 * ratio)
    ctx.fillText("我是" + this.data.userInfo.nickname, 140 * ratio, 424 * ratio)
    ctx.setFontSize(40 * ratio)
    ctx.fillText("老有所学，老有所乐，", 140 * ratio, 490 * ratio)
    ctx.fillText("邀请你一起学习交友。", 140 * ratio, 544 * ratio)
    ctx.fillRect(0, this.param.container.height - 210 * ratio, this.param.container.width, 210 * ratio)
    ctx.drawImage(this.data.qrcode, 50 * ratio, this.param.container.height - 210 / 2 + 50 / 2 / 2, 160 / 2, 160 / 2)
    ctx.setFillStyle("#3A3A3A")
    ctx.setTextBaseline("middle")
    ctx.setTextAlign("left")
    ctx.fillText("长按识别二维码", 240 * ratio, this.param.container.height - 130 / 2)
    ctx.fillText("一起在线学习", 240 * ratio, this.param.container.height - 80 / 2)
    ctx.restore()

    let that = this
    ctx.draw(true, () => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: this.param.container.width * 2 * ratio,
        height: this.param.container.height * 2 * ratio,
        destWidth: this.param.container.width * 8 * ratio,
        destHeight: this.param.container.height * 8 * ratio,
        canvasId: "canva_invite",
        success(res) {
          that.param.tempImg = res.tempFilePath
        },
        fail: res => {
          // console.log(res)
        }
      })
    })
  },
  onReady: function() {},
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  // 保存
  save() {
    let time = 0
    if (!this.param.tempImg) {
      wx.showLoading({
        title: "图片保存在...",
        mask: true
      })
      time = 1000
    }

    setTimeout(() => {
      wx.hideLoading()
      // 保存图片到系统相册
      wx.saveImageToPhotosAlbum({
        filePath: this.param.tempImg,
        success() {
          wx.showToast({
            title: "保存成功"
          })
        },
        fail(e) {
          wx.showToast({
            title: "保存失败"
          })
        }
      })
    }, time)
  },
  // 转发
  onShareAppMessage: function() {
    return {
      title: "网上老年大学",
      imageUrl: this.data.img,
      path: "/pages/loading/loading?uid=" + this.data.userInfo.id + "&type=invite"
    }
  }
})
