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
  /**
   * 绘制多行文本
   * @param ctx canvas对象
   * @param str 文本
   * @param startWidth 文本的起点
   * @param leftWidth 距离左侧的距离
   * @param initHeight 距离顶部的距离
   * @param titleHeight 文本的高度
   * @param canvasWidth 容器的宽度
   * @returns {width , height }
   */
  /* drawText: function(ctx, str, startWidth, leftWidth, initHeight, titleHeight, canvasWidth) {
    let lineWidth = 0
    let vernier = 0 //每次开始截取的字符串的索引
    let lastSubStrIndex = 0 //行标

    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width
      if (lastSubStrIndex == 0) {
        if (lineWidth >= canvasWidth - startWidth) {
          ctx.fillText(str.substring(0, i || 1), startWidth, initHeight) //绘制截取部分
          initHeight += titleHeight
          lineWidth = 0
          vernier = i || 1
          lastSubStrIndex += 1
        }
      } else {
        if (lineWidth >= canvasWidth) {
          ctx.fillText(str.substring(vernier, i), leftWidth, initHeight) //绘制截取部分
          initHeight += titleHeight
          lineWidth = 0
          vernier = i
          lastSubStrIndex += 1
        }
      }

      if (i == str.length - 1) {
        ctx.fillText(str.substring(vernier, i + 1), lastSubStrIndex == 0 ? startWidth : leftWidth, initHeight) //绘制剩余部分
        lastSubStrIndex > 0 && (lineWidth += ctx.measureText(str[i]).width)
      }
    }

    let res = {
      width: lineWidth + (lastSubStrIndex == 0 ? startWidth : leftWidth),
      height: initHeight
    }

    console.log(res)

    return res
  }, */
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
  onShareAppMessage: function() {
    return {
      title: "网上老年大学",
      imageUrl: this.data.img,
      path: "/pages/index/index"
    }
  }
})
