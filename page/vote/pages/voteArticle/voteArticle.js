// page/vote/pages/voteArticle/voteArticle.js
const app = getApp();
Page({
  data: {
    hocIndex: 0,
    item: {},
    commentList: [], //评论列表
    page: 1, //当前页码
    total_page: 1, //评论列表总页码
    total: 0, //总评论数量
    content: "", //评论内容
    placeholder: "发表你的观点", //候选字
    keyheight: 0, //键盘高度
    focus: false, //评论内容聚焦状态
    sharePoster: false, //展示分享海报
    userImg: "", //用户头像
    showImg: "", //展示图片
    code: "", //二维码
    imgs: "../../images/share-bg.png", //海报背景图片
    shareMessage: {}, //分享信息
    shareInfo: {}, //海报详情
    tempImg: "", //canvas临时路径
    jumpUrl: {}, //送花失败展示提示卡片
    showJump: false, //展示跳转卡片
  },
  onLoad: function (options) {
    if (!options.voteid || options.voteid == "") {
      wx.showToast({
        title: "课程已删除",
        icon: "none",
      });
      // wx.navigateBack();
      return;
    }
    this.getOpenId(options);
    this.init();
    this.getData(options.voteid);
    if (options.index) {
      //选中的index
      this.setData({
        hocIndex: options.index,
      });
    }
  },
  goVoteIndex() {
    wx.navigateTo({
      url: "/page/vote/pages/voteIndex/voteIndex",
    });
  },
  recordShare(options) {
    //记录分享
    // if(options)
  },
  getOpenId(ops) {
    let uid = wx.getStorageSync("userInfo").id;
    if (ops.accounts_openid && ops.accounts_openid != "") {
      wx.setStorageSync("AccountsId", ops.accounts_openid);
    } else if (wx.getStorageSync("AccountsId") == "" && uid) {
      //没有公众号的openId,voteType表示从哪个页面过去请求,之后方便返回
      wx.redirectTo({
        url: `/pages/education/education?voteType=voteArticle&voteid=${ops.voteid}&uid=${uid}`,
      });
    }
  },
  init() {
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
  getData(id) {
    return Promise.all(
      [this.getOpusInfo(id), this.getTeacherComment(id)],
      this.getPosterInfo(id)
    );
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
    let content = this.data.content.trim();
    if (content == "") {
      wx.showToast(
        {
          title: "评论不能为空",
          icon: "none",
        },
        1000
      );
      return;
    }
    let params = {
      teacher_id: this.data.item.id,
      content,
    };
    this.addTeacherComment(params);
  },
  delComment(e) {
    let { commentid, index } = e.currentTarget.dataset;
    let commentList = this.data.commentList;
    wx.showModal({
      content: "确定删除该评论?",
      confirmColor: "#df2020",
      success: (res) => {
        if (res.confirm) {
          app.vote
            .deleteTeacherComment({ comment_id: commentid })
            .then((res) => {
              commentList.splice(index, 1);
              this.setData({
                commentList,
              });
              wx.showToast({
                title: "删除成功",
                icon: "success",
                duration: 2000,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      },
    });
  },
  getOpusInfo(id) {
    //获取作品信息
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    let that = this;
    let invite_id = wx.getStorageSync("invite") || 0;
    // type:1 二维码; 2: 分享卡片
    let type = app.globalData.shareObj.f ? app.globalData.shareObj.f : 2;
    let params = { teacher_id: id, invite_id, type };
    app.vote
      .getOpusInfo(params)
      .then((res) => {
        wx.hideLoading();
        let title = res.data.teacher_info.name;
        that.setData({
          item: res.data.teacher_info,
          shareMessage: res.data.share_message,
        });
        if (title.length > 10) {
          //标题过长
          title = title.substr(0, 10) + "...";
        }
        wx.setNavigationBarTitle({
          title: title,
        });
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({
          title: err.msg,
          icon: "none",
          duration: 2000,
        });
      });
  },
  getPosterInfo(teacher_id) {
    //获取海报信息
    let params = { teacher_id };
    // let that = this;
    app.vote
      .getPosterInfo(params)
      .then((res) => {
        wx.hideLoading();
        this.setData({
          shareInfo: res.data,
          shareFlag: false,
        });
        //这里需要下载对应的网络图片资源并且开始绘画canvas
        // this.downloadImg(this.data.shareInfo.avatar, "userImg");
        // this.downloadImg(this.data.shareInfo.image, "showImg");
        // this.downloadImg(this.data.shareInfo.qrcode_url, "code"); //二维码下载
        // setTimeout(() => {
        //   wx.getSystemInfo({
        //     success: function (res) {
        //       var v = 750 / res.windowWidth; //获取手机比例
        //       // let system = res.system
        //       that.drawPoster(v);
        //     },
        //   });
        // }, 1000);
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({
          title: err.msg,
          icon: "none",
          duration: 1000,
        });
      });
  },
  getTeacherComment(id, page = 1) {
    let params = { teacher_id: id, page };
    let commentList = this.data.commentList;
    app.vote.getTeacherComment(params).then((res) => {
      let total_page = res.data.total_page;
      if (page == 1) {
        commentList = res.data.list;
      } else {
        commentList = commentList.concat(res.data.list);
      }
      this.setData({
        commentList,
        page,
        total_page,
        total: res.data.total,
      });
    });
  },
  addTeacherComment(params) {
    //新增评论
    app.vote.addTeacherComment(params).then((res) => {
      wx.showToast(
        {
          title: `评论成功，系统审核通过后发布`,
          icon: "none",
        },
        1000
      );
    });
  },
  shareImg(e) {
    let that = this;
    //点击生成海报
    wx.showLoading({
      title: "图片生成中...",
      mask: true,
    });
    this.setData({
      sharePoster: true,
    });
    //这里需要下载对应的网络图片资源并且开始绘画canvas
    this.downloadImg(this.data.shareInfo.avatar, "userImg");
    this.downloadImg(this.data.shareInfo.image, "showImg");
    this.downloadImg(this.data.shareInfo.qrcode_url, "code"); //二维码下载
    setTimeout(() => {
      wx.hideLoading();
      wx.getSystemInfo({
        success: function (res) {
          var v = 750 / res.windowWidth; //获取手机比例
          // let system = res.system
          that.drawPoster(v);
        },
      });
    }, 1000);
    // this.getPosterInfo(this.data.item.id);
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
    let openid = wx.getStorageSync("AccountsId");
    let params = {
      teacher_id: this.data.item.id,
      openid,
    };
    this.praiseOpus(params);
  },
  praiseOpus(params) {
    let that = this;
    app.vote
      .praiseOpus(params)
      .then((res) => {
        if (res.data.type == 1) {
          wx.showToast({
            title: res.msg,
            icon: "none",
            duration: 2500,
          });
          //送花成功
          let work = that.data.item;
          // work.flowers += work.flowers < 10000 ? 1 : 0;
          work.flowers += 1;
          that.setData({
            item: work,
          });
          let list = getCurrentPages();
          const page = list[list.length - 2];
          if (page.route == "page/vote/pages/voteIndex/voteIndex") {
            page.setLikeData(that.data.hocIndex);
          }
        } else {
          that.setData({
            jumpUrl: res.data.jump_info,
            showJump: true,
          });
        }
      })
      .catch((err) => {
        wx.showToast({
          title: err.msg,
          icon: "none",
          duration: 2500,
        });
      });
  },
  jumpPeper() {
    //活动弹窗
    let item = this.data.jumpUrl;
    this.closeJump(); //关闭卡片,跳转
    if (item.type == 1) return; //缺少鲜花
    if (item.jump_type == 1) {
      //外连接
      wx.navigateTo({
        url: `/pages/education/education?type=0&url=${item.clickurl}`,
      });
    } else if (item.jump_type == 2) {
      //小程序的tab页
      wx.switchTab({
        url: item.clickurl,
      });
    } else if (item.jump_type == 4) {
      //小程序内的页面
      wx.navigateTo({
        url: item.clickurl,
      });
    }
  },
  closeJump() {
    this.setData({
      showJump: false,
    });
  },
  unshare() {
    this.setData({
      sharePoster: false,
    });
  },
  setImage(res, data) {
    let _this = this;
    switch (data) {
      case "code":
        _this.setData({
          code: res.tempFilePath,
        });
        break;
      case "userImg":
        _this.setData({
          userImg: res.tempFilePath,
        });
        break;
      case "showImg":
        _this.setData({
          showImg: res.tempFilePath,
        });
        break;
      default:
        //没有下载
        break;
    }
  },
  downloadImg(url, data) {
    let _this = this;
    wx.downloadFile({
      url: url,
      success: function (res) {
        if (res.statusCode === 200) {
          _this.setImage(res, data);
        } else {
          console.log(res);
        }
      },
      fail: function (err) {
        console.log(err);
        //获取网络图片临时目录path
        wx.getImageInfo({
          src: url,
          success: function (res) {
            //res.path是网络图片的本地地址
            _this.setImage(res, data);
          },
          fail: function (res) {},
        });
        // wx.showToast({
        //   title: "图片下载失败",
        //   icon: 'none',
        //   duration: 1000
        // })
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
    // 圆的圆心的 x 坐标和 y 坐标，半径，后面的两个参数就是起始和结束
    ctx.arc(78 / v, 78 / v, 45 / v, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(this.data.userImg, 30 / v, 31 / v, 90 / v, 90 / v);
    ctx.restore();
    ctx.setFontSize(40 / v);
    ctx.setFillStyle("white");
    ctx.fillText(this.data.shareInfo.name, 150 / v, 65 / v);
    ctx.setFontSize(28 / v);
    ctx.setFillStyle("white");
    // ctx.fillText("作品编号: " + this.data.item.id, 150 / v, 115 / v);
    ctx.fillText(this.data.shareInfo.class_name, 150 / v, 115 / v);
    ctx.restore(); //恢复限制
    //分享图片
    ctx.rect(30 / v, 157 / v, 570 / v, 380 / v);
    ctx.lineJoin = "round";
    ctx.lineWidth = 20 / v;
    //作品图片
    ctx.drawImage(this.data.showImg, 30 / v, 157 / v, 570 / v, 380 / v);

    //作品名称
    // ctx.setFontSize(40 / v);
    // ctx.setFillStyle("white");
    // ctx.fillText(this.data.shareInfo.opus_name, 30 / v, 598 / v, 560 / v);
    // ctx.save();
    //作品内容
    // ctx.rect(30 * ratio, 616 * ratio, 570 * ratio, 172 * ratio)
    ctx.setFontSize(40 * ratio);
    ctx.setFillStyle("white");
    //可以尝试切割字符串,循环数组,达到换行的效果
    let info = this.data.shareInfo.brief;
    let len = 0;
    if (info.length > 14 && info.length < 42) {
      //三行以内
      for (var a = 0; a < 3; a++) {
        let content = info.substr(len, 14);
        len += 14;
        ctx.fillText(content, 30 * ratio, (598 + a * 48) / v);
      }
    } else if (info.length > 42) {
      //超过三行
      let con1 = info.substr(len, 14);
      let con2 = info.substr(14, 12) + "...";
      ctx.fillText(con1, 30 * ratio, 598 / v);
      ctx.fillText(con2, 30 * ratio, (598 + 48) / v);
    } else {
      //就一行
      ctx.fillText(info, 30 * ratio, 598 / v);
    }

    ctx.restore();

    //二维码
    ctx.save();
    ctx.setFillStyle("white");
    // ctx.lineJoin = "round";
    // ctx.lineWidth = 20 / v;

    ctx.fillRect(0 / v, 740 / v, 630 / v, 235 / v);
    ctx.drawImage(this.data.code, 30 / v, 761 / v, 170 / v, 170 / v);
    ctx.setFontSize(40 / v);
    ctx.setFillStyle("#666666");
    ctx.fillText("长按识别二维码", 210 / v, 826 / v);
    ctx.fillText("为老师送花助力加油!", 210 / v, 877 / v);
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
  onPullDownRefresh() {
    this.setData({
      commentList: [],
      content: [],
      page: 1,
      total_page: 1,
    });
    this.getData(this.data.item.id).then((res) => {
      wx.showToast({
        title: "刷新完成",
        duration: 1000,
      });
      wx.stopPullDownRefresh();
    });
  },
  onReachBottom() {
    if (this.data.total_page > this.data.page) {
      this.getTeacherComment(this.data.item.id, this.data.page + 1);
    } else {
      if (this.data.page != 1) {
        wx.showToast({
          icon: "none",
          title: "已经到底了哦",
          duration: 1000,
        });
      }
    }
  },
  onShareAppMessage() {
    let item = this.data.item;
    let uid = wx.getStorageSync("userInfo").id;
    let title = this.data.shareMessage.title;
    return {
      title,
      path:
        "/page/vote/pages/voteArticle/voteArticle?voteid=" +
        item.id +
        "&type=share&vote=1&uid=" +
        uid, // 路径，传递参数到指定页面。
      imageUrl: item.image,
    };
  },
});
