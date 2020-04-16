// pages/voteDetail/voteDetail.js
const app = getApp();
let videoCtx = null;
Page({
  data: {
    shareTitle: '',
    infoFlag: {}, //活动时间以及弹窗提示
    hocIndex: Number,
    current: 0,
    pause: false,
    zan: false,
    guideFlag: [0, 0, 0], //引导显示状态
    shareFlag: false,
    sharePoster: false,
    overTime: 0, //活动是否过期  0=未过期,1=已过期
    // supportFlag: 0, //点赞权限
    zanFlag: false, //点赞动画
    waitingFlag: false,
    userImg: "", //用户头像
    showImg: "", //展示图片
    code: "", //二维码
    imgs: "/images/share-bg.png", //海报背景图片
    tempImg: "", //canvas临时路径
    item: {}, //作品详情
    shareInfo: {} //海报信息
  },
  nextGuide(e) {
    if (e.currentTarget.dataset.guide == "first") {
      this.setData({
        guideFlag: [1, 1, 0]
      });
    } else if (e.currentTarget.dataset.guide == "second") {
      this.setData({
        guideFlag: [1, 1, 1]
      });
    } else {
      this.setData({
        guideFlag: [0, 1, 1]
      });
      app.vote.noteGuide();
    }
  },
  preview(e){
    let url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: this.data.item.url
    })
  },
  aniend(e) {
    //动画播放结束
    this.setData({
      zanFlag: false
    });
    // wx.showToast({
    //   title: "今日点赞成功",
    //   icon: "none",
    //   duration: 2500
    // });
  },
  giveLike(e) {
    //step  活动是否过期
    // step1 判断今天是否点赞过
    // step2  作品点赞数添加 （修改data中数据），不刷新页面
    if (this.data.infoFlag.flag == 0) {
      wx.showToast({
        title: this.data.infoFlag.msg,
        icon: "none",
        duration: 1500
      });
    } else {
      if (this.data.item.is_praise == 1) {
        //提示
        wx.showToast({
          title: "您今日已点赞,去看看其他作品~",
          icon: "none",
          duration: 1500
        });
      } else {
        let params = {
          id: e.currentTarget.dataset.id,
          type: this.data.item.hoc_id
        };
        this.praiseOpus(params);
      }
    }
  },
  praiseOpus(params) {
    let that = this;
    app.vote
      .praiseOpus(params)
      .then(res => {
        let work = that.data.item;
        if (work.prise_numbers<10000) work.prise_numbers += 1;
        work.is_praise = 1;
        that.setData({
          item: work,
          // supportFlag: 0,
          zanFlag: true
        });
        let list = getCurrentPages();
        const page = list[list.length - 2];
        if (page.route == "pages/vote/vote") {
          page.setLikeData(that.data.hocIndex);
        }
      })
      .catch(err => {
        wx.showToast({
          title: err.msg,
          icon: "none",
          duration: 2500
        });
      });
  },
  unshare() {
    this.setData({
      sharePoster: false
    });
  },
  toVote() {
    let list = getCurrentPages();
    if (list[1]) {
      if (list[1].route == "pages/vote/vote") {
        //小程序主页进来的
        wx.navigateBack({
          delta: list.length - 2
        });
      } else if (list[0].route == "pages/vote/vote") {
        //分享进来的
        wx.navigateBack({
          delta: list.length
        });
      }
    } else {
      wx.reLaunch({
        url: "/pages/vote/vote"
      });
    }
  },
  toJoin() {
    wx.navigateTo({
      url: "/pages/voteProduction/voteProduction"
    });
  },
  changeIndex(e) {
    this.setData({
      current: e.detail.current
    });
  },
  controlVideo() {
    //音频播放
    videoCtx = wx.createVideoContext("videoWorks", this);
    if (this.data.pause) {
      videoCtx.play();
      this.setData({
        pause: false
      });
    } else {
      videoCtx.pause();
      this.setData({
        pause: true
      });
    }
  },
  videoplay(e) {
    //播放时触发
    this.setData({
      pause: false
    });
  },
  videoend() {
    //播放结束
    this.setData({
      pause: true
    });
  },
  getOpusInfo(id) {
    let params = { id: id };
    app.vote.getOpusInfo(params).then(res => {
      let temp = res.data.is_guide;
      this.setData({
        item: res.data,
        shareTitle: res.data.share_title || '同心抗疫 老年大学在行动',
        // supportFlag: res.data.have_praise,
        guideFlag: [!temp, 0, 0],
        infoFlag: res.data.info
      });
      let title = this.data.item.name;
      if (title.length > 10) {
        //标题过长
        title = title.substr(0, 10) + "...";
      }
      wx.setNavigationBarTitle({
        title: title
      });
      //如果是视频就自动播放
    });
  },
  getPosterInfo(ho_id) {
    let params = { ho_id: ho_id };
    let that = this;
    app.vote.getPosterInfo(params).then(res => {
      wx.hideLoading();
      this.setData({
        shareFlag: false,
        sharePoster: true
      });
      this.setData({
        shareInfo: res.data
      });
      //这里需要下载对应的网络图片资源并且开始绘画canvas
      this.downloadImg(this.data.shareInfo.avatar, "userImg");
      if (this.data.item.type == 1) {
        this.downloadImg(this.data.shareInfo.opus_url, "showImg"); //图片下载
      } else {
        this.downloadImg(this.data.shareInfo.opus_banner_image, "showImg"); //视频封面下载
      }
      this.downloadImg(this.data.shareInfo.qrcode_url, "code"); //二维码下载
      setTimeout(() => {
        wx.getSystemInfo({
          success: function(res) {
            var v = 750 / res.windowWidth; //获取手机比例
            that.drawPoster(v);
          }
        });
      }, 500);
    });
  },
  shareMode() {
    //弹出样式
    this.setData({
      shareFlag: true
    });
  },
  shareImg(e) {
    //点击生成海报
    wx.showLoading({
      title: "图片生成中...",
      mask: true
    });

    this.getPosterInfo(this.data.item.id);
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
              icon: "success"
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
              success: modalSuccess => {
                wx.openSetting({
                  success(settingdata) {
                    //授权状态
                    if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                      wx.showToast(
                        {
                          title: "获取权限成功,再次点击即可保存",
                          icon: "none"
                        },
                        500
                      );
                    } else {
                      wx.showToast(
                        {
                          title: "获取权限失败，将无法保存到相册哦~",
                          icon: "none"
                        },
                        500
                      );
                    }
                  },
                  fail(failData) {
                    console.log("failData", failData);
                  }
                });
              }
            });
          }
        }
      });
    }, 1000);
  },
  shareOff() {
    //取消分享
    this.setData({
      shareFlag: false
    });
  },
  downloadImg(url, data) {
    let that = this;
    wx.downloadFile({
      url: url,
      success: function(res) {
        switch (
          data //临时路径
        ) {
          case "code":
            that.setData({
              code: res.tempFilePath
            });
            break;
          case "userImg":
            that.setData({
              userImg: res.tempFilePath
            });
            break;
          case "showImg":
            that.setData({
              showImg: res.tempFilePath
            });
            break;
          default:
            //没有下载
            break;
        }
      }
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
    ctx.fillText("正在参赛......", 150 / v, 115 / v);
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
    ctx.draw(true, () => {
      let timer = setTimeout(() => {
        wx.canvasToTempFilePath(
          {
            x: 0,
            y: 0,
            width: 315,
            height: 470,
            destWidth: (315 * 750) / windowWidth,
            destHeight: (470 * 750) / windowWidth,
            canvasId: "poster",
            // fileType: 'jpg',  //如果png的话，图片存到手机可能有黑色背景部分
            success(res) {
              //生成成功
              that.setData({
                tempImg: res.tempFilePath
              });
              clearTimeout(timer);
            },
            fail: res => {
              //生成失败
              clearTimeout(timer);
            }
          },
          this
        );
      }, 100);
    });
  },
  onLoad(options) {
    // this.store.$state.userInfo
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      if (options.flag == "true") {
        //未审核
        this.setData({
          waitingFlag: options.flag
        });
      }
      this.getOpusInfo(options.voteid);
    } else {
      console.log("没有用户信息,即新用户");
    }
    if (options.index) {
      //选中的index
      this.setData({
        hocIndex: options.index
      });
    }
    wx.hideShareMenu();
  },
  onShareAppMessage(ops) {
    let item = this.data.item;
    let id = item.id;
    let uid = wx.getStorageSync("userInfo").id;
    let imgUrl = this.data.imgs;
    let title = this.data.shareTitle;
    if (item.type == 2) {
      imgUrl = item.banner_image;
    } else if (item.type == 1) {
      imgUrl = item.url[0];
    }
    return {
      title: title,
      path:
        "/pages/voteDetail/voteDetail?voteid=" +
        id +
        "&type=share&vote=0&uid=" +
        uid, // 路径，传递参数到指定页面。
      imageUrl: imgUrl,
      success: function(res) {
        // 转发成功
        console.log("转发成功");
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败");
      }
    };
  },
  onHide() {
    videoCtx = wx.createVideoContext("videoWorks", this);
    videoCtx.stop();
    this.setData({
      pause: true
    });
    videoCtx = null;
  }
});
