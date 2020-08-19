// page/vote/pages/voteArticle/voteArticle.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    voteDetail: {
      id: 2,
      name: "汪得章",
      introduce: "这是一个无耻得人",
      image:
        "https://xiehui-guanwang.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/20190815%5Ca6dbd1bf97aeb528e2aa6964fb2ab468.jpg",
    },
    content: "", //评论内容
    placeholder: "发表你的观点", //候选字
    keyheight: 0, //键盘高度
    focus: false, //评论内容聚焦状态
    sharePoster: false, //展示分享海报
    shareInfo: {
      id: 63,
      nickname: "老汪",
      opus_content:
        "戴口罩，勤洗手，不聚会，少出门，向一线的医务工作者致敬，为武汉加油！",
    }, //海报详情
    tempImg: "", //canvas临时路径
  },
  input(e) {
    //输入
    console.log(e.detail.value);
  },
  onLoad: function (options) {
    this.init(options);
  },
  onShow: function () {},
  init(options) {
    //监听键盘变化
    wx.onKeyboardHeightChange((res) => {
      if (this.data.keyheight == 0) {
        this.setData({
          keyheight: res.height,
        });
      } else {
        if (res.height <= 0) {
          this.setData({
            keyheight: 0,
            writeTow: false,
          });
        }
      }
    });
  },
  showWrite(e) {
    if (this.data.$state.userInfo.status !== "normal") {
      wx.showModal({
        content:
          "由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理",
        confirmColor: "#df2020",
      });
    } else {
      this.setData({
        focus: true,
        writeTow: true,
        placeholder: "",
        contenLength: this.data.content.length || 0,
      });
      let system = {};
      wx.getSystemInfo({
        success: (res) => {
          system = res;
        },
      });
      if (system.screenHeight <= 700) this.setscrollto();
    }
  },
  setscrollto() {
    let query = wx.createSelectorQuery().in(this);
    query.select(".vote-article-page").boundingClientRect();
    query.exec((res) => {
      if (res[0].top > -100) {
        wx.pageScrollTo({
          scrollTop: 250,
        });
      }
    });
  },
  bindblur() {
    this.setData({
      keyheight: 0,
      writeTow: false,
    });
  },
  input(e) {
    this.setData({
      content: e.detail.value,
      contenLength: e.detail.value.length,
    });
  },
  release() {
    console.log("发表评论");
    let content = this.data.content.trim();
    console.log(content);
  },
  getPosterInfo(ho_id) {
    console.log("分享");
    let params = { ho_id: ho_id };
    let that = this;
    // app.vote.getPosterInfo(params).then((res) => {
    //   wx.hideLoading();
    //   this.setData({
    //     shareInfo: res.data,
    //     shareFlag: false,
    //     sharePoster: true,
    //   });
    //   //这里需要下载对应的网络图片资源并且开始绘画canvas
    //   this.downloadImg(this.data.shareInfo.avatar, "userImg");
    //   if (this.data.voteDetail.type == 1) {
    //     this.downloadImg(this.data.shareInfo.opus_url, "showImg"); //图片下载
    //   } else {
    //     this.downloadImg(this.data.shareInfo.opus_banner_image, "showImg"); //视频封面下载
    //   }
    //   this.downloadImg(this.data.shareInfo.qrcode_url, "code"); //二维码下载
    //   setTimeout(() => {
    //     wx.getSystemInfo({
    //       success: function (res) {
    //         var v = 750 / res.windowWidth; //获取手机比例
    //         // let system = res.system
    //         that.drawPoster(v);
    //       },
    //     });
    //   }, 1000);
    // });
  },
  shareImg(e) {
    //点击生成海报
    wx.showLoading({
      title: "图片生成中...",
      mask: true,
    });
    this.getPosterInfo(this.data.voteDetail.id);
  },
  savePoster() {
    //保存本地
    let that = this;
    setTimeout(() => {
      wx.saveImageToPhotosAlbum({
        filePath: that.data.tempImg,
        success(res) {
          wx.showToast(
            {
              title: "保存成功",
              icon: "success",
            },
            1000
          );
          that.unshare();
          that.shareOff(); //关闭窗口
        },
        fail(err) {
          //授权问题报错
          if (
            err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" ||
            err.errMsg === "saveImageToPhotosAlbum:fail auth deny" ||
            err.errMsg === "saveImageToPhotosAlbum:fail authorize no response"
          ) {
            wx.showModal({
              title: "提示",
              content: "需要您授权保存相册",
              showCancel: false,
              success: (modalSuccess) => {
                wx.openSetting({
                  success(settingdata) {
                    //授权状态
                    if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                      wx.showToast(
                        {
                          title: "获取权限成功,再次点击即可保存",
                          icon: "none",
                        },
                        500
                      );
                    } else {
                      wx.showToast(
                        {
                          title: "获取权限失败，将无法保存到相册哦~",
                          icon: "none",
                        },
                        500
                      );
                    }
                  },
                  fail(failData) {
                    console.log("failData", failData);
                  },
                });
              },
            });
          }
        },
      });
    }, 500);
  },
  sendFlower() {
    console.log("送花");
  },
  unshare() {
    this.setData({
      sharePoster: false,
    });
  },
  downloadImg(url, data) {
    let that = this;
    wx.downloadFile({
      url: url,
      success: function (res) {
        switch (
          data //临时路径
        ) {
          case "code":
            that.setData({
              code: res.tempFilePath,
            });
            break;
          case "userImg":
            that.setData({
              userImg: res.tempFilePath,
            });
            break;
          case "showImg":
            that.setData({
              showImg: res.tempFilePath,
            });
            break;
          default:
            //没有下载
            break;
        }
      },
    });
  },
  drawPoster(v) {
    let that = this;
    let ratio = 0.5;
    let ctx = wx.createCanvasContext("poster", this);
    ctx.drawImage(this.data.imgs, 0, 0, 630 / v, 812 / v);
    ctx.save();
    ctx.beginPath();
    //头部
    // ctx.rect(30 / v, 31 / v, 570 / v, 96 / v)

    ctx.save();
    // 圆的圆心的 x 坐标和 y 坐标，25 是半径，后面的两个参数就是起始和结束，这样就能画好一个圆了
    ctx.arc(78 / v, 78 / v, 48 / v, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(this.data.userImg, 30 / v, 31 / v, 96 / v, 96 / v);
    ctx.restore();
    ctx.setFontSize(30 / v);
    ctx.setFillStyle("white");
    ctx.fillText(this.data.shareInfo.nickname, 150 / v, 65 / v);
    ctx.setFontSize(28 / v);
    ctx.setFillStyle("white");
    ctx.fillText("作品编号: " + (this.data.voteDetail.id), 150 / v, 115 / v);
    ctx.restore(); //恢复限制
    //分享图片
    ctx.rect(30 / v, 157 / v, 570 / v, 380 / v);
    ctx.lineJoin = "round";
    ctx.lineWidth = 20 / v;
    //作品图片
    let worksImg = this.data.showImg || "/images/vote-wei.png";
    ctx.drawImage(worksImg, 30 / v, 157 / v, 570 / v, 380 / v);

    //作品名称
    ctx.setFontSize(40 / v);
    ctx.setFillStyle("white");
    ctx.fillText(this.data.shareInfo.opus_name, 30 / v, 598 / v, 560 / v);
    ctx.save();
    //作品内容
    // ctx.rect(30 * ratio, 616 * ratio, 570 * ratio, 172 * ratio)

    ctx.setFontSize(36 * ratio);
    ctx.setFillStyle("white");
    //可以尝试切割字符串,循环数组,达到换行的效果
    let info = this.data.shareInfo.opus_content;
    let len = 0;
    if (info.length > 15 && info.length < 30) {
      //两行以内
      for (var a = 0; a < 2; a++) {
        let content = info.substr(len, 15);
        len += 15;
        ctx.fillText(content, 30 * ratio, (658 + a * 48) / v);
      }
    } else if (info.length > 30) {
      //超过三行
      let con1 = info.substr(len, 15);
      let con2 = info.substr(15, 14) + "...";
      ctx.fillText(con1, 30 * ratio, 658 / v);
      ctx.fillText(con2, 30 * ratio, (658 + 48) / v);
    } else {
      //就一行
      ctx.fillText(info, 30 * ratio, 658 / v);
    }

    ctx.restore();

    //二维码
    ctx.save();
    ctx.setFillStyle("white");
    // ctx.lineJoin = "round";
    // ctx.lineWidth = 20 / v;

    ctx.fillRect(0 / v, 740 / v, 630 / v, 235 / v);
    ctx.drawImage(this.data.code, 30 / v, 761 / v, 153 / v, 153 / v);
    ctx.setFontSize(36 / v);
    ctx.setFillStyle("#666666");
    ctx.fillText("长按识别二维码", 210 / v, 826 / v);
    ctx.fillText("为好友加油,一起参赛!", 210 / v, 877 / v);
    // ctx.setFillStyle('white');
    // ctx.fill();
    // ctx.draw();
    ctx.restore();
    let windowWidth = wx.getSystemInfoSync().windowWidth;
    let width = 375;
    let height = 600;
    // if (system.indexOf("Android") > -1 || system.indexOf("Linux") > -1) {
    //   width = 315;
    //   height = 470;
    //   console.log("安卓机子",width,height)
    // }
    ctx.draw(true, () => {
      let timer = setTimeout(() => {
        wx.canvasToTempFilePath(
          {
            x: 0,
            y: 0,
            width: width,
            height: height,
            destWidth: (width * 750) / windowWidth,
            destHeight: (height * 750) / windowWidth,
            canvasId: "poster",
            // fileType: 'jpg',  //如果png的话，图片存到手机可能有黑色背景部分
            success(res) {
              //生成成功
              that.setData({
                tempImg: res.tempFilePath,
              });
              clearTimeout(timer);
            },
            fail: (res) => {
              //生成失败
              clearTimeout(timer);
            },
          },
          this
        );
      }, 100);
    });
  },
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {
    console.log("分享");
    // let item = this.data.voteDetail;
    // let id = item.id;
    // let uid = wx.getStorageSync("userInfo").id;
    // let imgUrl = this.data.imgs;
    // let title = this.data.shareTitle;
    // if (item.type == 2) {
    //   imgUrl = item.banner_image;
    // } else if (item.type == 1) {
    //   imgUrl = item.url[0];
    // }
    // return {
    //   title: title,
    //   path:
    //     "/pages/voteArticle/voteArticle?voteid=" +
    //     id +
    //     "&type=share&vote=0&uid=" +
    //     uid, // 路径，传递参数到指定页面。
    //   imageUrl: imgUrl,
    //   success: function (res) {
    //     // 转发成功
    //     console.log("转发成功");
    //   },
    //   fail: function (res) {
    //     // 转发失败
    //     console.log("转发失败");
    //   },
    // };
  },
});
