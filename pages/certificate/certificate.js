//index.js
//获取应用实例
const app = getApp()
Page({
  data: {},
  onLoad(options) {
    this.setData({
      course: options["name"]
    })
    this.draw()
  },
  // 绘制证书
  draw() {
    let userInfo = JSON.parse(JSON.stringify(this.data.$state.userInfo))
    userInfo.nickname = userInfo.nickname || "如此优秀的你"
    let course = this.data.course
    this.context = wx.createCanvasContext("myCanvas", this)
    let r = wx.getSystemInfoSync().windowWidth / 750
    // 背景图
    this.context.drawImage("../../images/certificate.png", 0, 0, 690 * r, 912 * r)
    // 文字
    this.context.setFillStyle("#3A3A3A")
    this.context.setFontSize(40 * r)
    this.context.setTextBaseline("top")
    this.context.fillText(userInfo.nickname, 107 * r + (200 * r - this.context.measureText(userInfo.nickname).width) / 2, 340 * r, 200 * r)
    this.context.setFontSize(36 * r)
    this.context.fillText(course, 180 * r + (310 * r - this.context.measureText(course).width) / 2, 425 * r, 310 * r)
    this.context.setTextAlign("right")
    this.context.setFontSize(28 * r)
    this.context.fillText(app.util.dateUnit(), 595 * r, 780 * r)
    let that = this
    this.context.draw(true, () => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 690 * r,
        height: 912 * r,
        destWidth: 690,
        destHeight: 912,
        canvasId: "myCanvas",
        success(res) {
          that.setData({
            img: res.tempFilePath
          })
        },
        fail: res => {
          // console.log(res)
        }
      })
    })
  },
  // 保存
  save() {
    // 保存图片到系统相册
    wx.saveImageToPhotosAlbum({
      filePath: this.data.img,
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
  // 转发
  onShareAppMessage: function(ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button")
      return {
        title: "福利！老年大学十万集免费课程在线学习",
        path: "/pages/loading/loading"
      }
    }
  }
})
