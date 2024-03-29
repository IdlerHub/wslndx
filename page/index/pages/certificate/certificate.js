//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    none: false
  },
  pageName: '证书（云课堂观看完成证书）',
  onLoad(options) {
    this.setData({
      course: options["name"]
    })
    this.draw()
  },
  // 绘制证书
  draw() {
    let userInfo = JSON.parse(JSON.stringify(this.data.$state.userInfo))
    userInfo.nickname = userInfo.name || userInfo.nickname || "如此优秀的你"
    let course = this.data.course
    this.context = wx.createCanvasContext("myCanvas", this)
    let r = wx.getSystemInfoSync().windowWidth / 750
    // 背景图
    this.context.drawImage("../../images/certificate.png", 0, 0, 690 * r, 1057 * r)
    // 文字
    this.context.fillStyle = '#3A3A3A'
    this.context.font = `20px sans-serif`
    this.context.setTextBaseline("top")
    this.context.fillText(userInfo.nickname, 107 * r + (200 * r - this.context.measureText(userInfo.nickname).width) / 2, 345 * r, 200 * r)
    this.context.font = `18px sans-serif`
    if(this.context.measureText(course).width < 170) {
      this.context.fillText(course, 180 * r + (310 * r - this.context.measureText(course).width) / 2, 430 * r, 310 * r)
    } else if (this.context.measureText(course).width > 170 && this.context.measureText(course).width < 220) {
      this.context.fillText(course, 180 * r + (348 * r - this.context.measureText(course).width) / 2, 430 * r, 310 * r) 
    } else if(this.context.measureText(course).width > 220 && this.context.measureText(course).width < 300){
      this.context.fillText(course, 180 * r + (522 * r - this.context.measureText(course).width) / 2, 430 * r, 310 * r)
    } else {
      this.context.fillText(course, 180 * r + (730 * r - this.context.measureText(course).width) / 2, 430 * r, 310 * r)
    }
    this.context.font = `15px sans-serif`
    this.context.setFillStyle('#666666')
    this.context.fillText(app.util.dateUnit(), 92 * r, 856 * r)
    // this.context.setTextAlign("right")
    let that = this
    this.context.draw(true, () => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 690 * r,
        height: 1057 * r,
        destWidth: 690,
        destHeight: 1057,
        canvasId: "myCanvas",
        success(res) {
          that.setData({
            img: res.tempFilePath,
            none: true
          })
        },
        fail: res => {
        }
      })
    })
  },
  // 保存
  save() {
    // 保存图片到系统相册
    let that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.img,
      success() {
       wx.uma.trackEvent("savaCertificate", { [`$uid_${that.data.$state.userInfo.id}`]: that.data.course});
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
  // 转发
  onShareAppMessage: function (ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    wx.uma.trackEvent("savaCertificate", { [`$uid_${this.data.$state.userInfo.id}`]: this.data.course});
    if (ops.from === "button") {
      return {
        title: "福利！老年大学十万集免费课程在线学习",
        path: "/pages/index/index"
      }
    }
  }
})