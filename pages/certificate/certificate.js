//index.js
//获取应用实例
const app = getApp();
Page({
    data: {
        IMG_URL: app.IMG_URL,
    },
    onLoad(options) {
        this.setData({
            course: options['name'],
            userInfo: wx.getStorageSync('userInfo'),
        })
        this.draw();
    },
    // 绘制证书
    draw() {
        let userInfo = this.data.userInfo;
        let course = this.data.course;
        this.context = wx.createCanvasContext('myCanvas');
        let r = wx.getSystemInfoSync().windowWidth / 750;
        // 背景图
        this.context.drawImage('../../images/certificate.png', 0, 0, 670 * r, 500 * r);
        // 文字
        this.context.setFillStyle('#75711A');
        this.context.setFontSize(24 * r);
        this.context.fillText(userInfo.nickname, 135 * r + (120 * r - this.context.measureText(userInfo.nickname).width) / 2, 250 * r, 120 * r);
        this.context.setFontSize(24 * r);
        this.context.fillText(`《 ${course}》`, 120 * r + (450 * r - this.context.measureText(course).width) / 2, 298 * r, 450 * r);
        this.context.setFontSize(20 * r);
        this.context.fillText(app.util.formatTime(), 120 * r, 380 * r);
        let that = this;
        this.context.draw(true, () => {
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
                    title: '保存成功',
                });
            },
            fail() {
                wx.showToast({
                    title: '保存失败',
                });
            }
        })
    },
    // 转发
    onShareAppMessage: function () {
        return {
            title: '网上老年大学',
            imageUrl: this.data.img,
            path: 'pages/index/index',
        }
    },

});