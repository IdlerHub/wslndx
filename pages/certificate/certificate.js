//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        IMG_URL: app.IMG_URL,
    },
    onLoad(options) {
        this.setData({
            course: options.name,
            userInfo: wx.getStorageSync('userInfo'),
        })
        this.draw();
    },
    // 绘制证书
    draw() {
        var that = this;
        var r, userInfo = this.data.userInfo,
            course = this.data.course;
        this.context = wx.createCanvasContext('myCanvas')
        let systemInfo = wx.getSystemInfoSync();
        r = systemInfo.windowWidth / 750;
        // 背景图
        that.context.drawImage('../../images/certificate.png', 0, 0, 670 * r, 500 * r)
            // 文字
        that.context.setFillStyle('#75711A')
        that.context.setFontSize(24 * r)
        that.context.fillText(userInfo.nickname, 135 * r + (120 * r - that.context.measureText(userInfo.nickname).width) / 2, 250 * r, 120 * r)
        that.context.setFontSize(24 * r)
        that.context.fillText(`《 ${course}》`, 120 * r + (450 * r - that.context.measureText(course).width) / 2, 298 * r, 450 * r)
        that.context.setFontSize(20 * r)
        that.context.fillText(app.util.formatTime(), 120 * r, 380 * r)
        that.context.draw(true, function() {
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 670 * r,
                height: 500 * r,
                destWidth: 670,
                destHeight: 500,
                canvasId: 'myCanvas',
                success(res) {
                    that.setData({
                        img: res.tempFilePath
                    })
                },
                fail(res) {
                    console.log(res)
                }
            }, that)
        })
    },
    // 保存
    save() {
        var that = this
            // 保存图片到系统相册  
        wx.saveImageToPhotosAlbum({
            filePath: that.data.img,
            success(res) {
                wx.showToast({
                    title: '保存成功',
                });
            },
            fail(res) {
                wx.showToast({
                    title: '保存失败',
                });
            }
        })
    },
    // 转发
    onShareAppMessage: function(res) {
        var that = this;
        return {
            title: '网上老年大学',
            imageUrl: that.data.img,
            path: 'pages/index/index',
        }
    },
 
})