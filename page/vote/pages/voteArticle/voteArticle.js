// page/vote/pages/voteArticle/voteArticle.js
const app = getApp();
Page({
  data: {
    hocIndex: 0,
    item: {
      id: 2,
      name: "汪得章",
      introduce: "这是一个无耻得人",
      image:
        "https://xiehui-guanwang.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/20190815%5Ca6dbd1bf97aeb528e2aa6964fb2ab468.jpg",
    },
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
    shareTitle: "", //分享标题
    shareInfo: {
      id: 63,
      nickname: "老汪",
      opus_content:
        "戴口罩，勤洗手，不聚会，少出门，向一线的医务工作者致敬，为武汉加油！",
    }, //海报详情
    tempImg: "", //canvas临时路径
    jumpUrl: {}, //送花失败展示提示卡片
    showJump: false, //展示跳转卡片
  },
  onLoad: function (options) {
    console.log(options);
    if (!options.voteid || options.voteid == "") {
      wx.showToast({
        title: "参数有误",
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
  getOpenId(ops) {
    if (ops.accounts_openid && ops.accounts_openid != "") {
      wx.setStorageSync("AccountsId", ops.accounts_openid);
    } else if (wx.getStorageSync("AccountsId") == "") {
      //如果没有公众号的openId,跳转去授权页面
      let uid = wx.getStorageSync("userInfo").id;
      console.log("没有公众号的openid");
      //voteType表示从哪个页面过去请求,之后方便返回
      wx.redirectTo({
        url: `/pages/education/education?voteType=voteArticle&voteid=${ops.voteid}&uid=${uid}`,
      });
    }
  },
  onShow: function () {},
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
    return Promise.all([this.getOpusInfo(id), this.getTeacherComment(id)]);
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
    console.log(e.currentTarget.dataset);
    let { commentid, index } = e.currentTarget.dataset;
    let commentList = this.data.commentList;
    app.vote
      .deleteTeacherComment({ comment_id: commentid })
      .then((res) => {
        console.log(res);
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
  },
  getOpusInfo(id) {
    //获取作品信息
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    let that = this;
    let params = { teacher_id: id };
    app.vote
      .getOpusInfo(params)
      .then((res) => {
        wx.hideLoading();
        let title = res.data.name;
        that.setData({
          item: res.data,
          shareTitle: res.data.share_title || "别改了,黄花菜都凉了",
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
    console.log("分享");
    let params = { teacher_id };
    let that = this;
    app.vote.getPosterInfo(params).then((res) => {
      wx.hideLoading();
      this.setData({
        shareInfo: res.data,
        shareFlag: false,
        sharePoster: true,
      });
      console.log(this.data.shareInfo);
      //这里需要下载对应的网络图片资源并且开始绘画canvas
      this.downloadImg(this.data.shareInfo.avatar, "userImg");
      this.downloadImg(this.data.shareInfo.image, "showImg"); //视频封面下载
      this.downloadImg(this.data.shareInfo.qrcode_url, "code"); //二维码下载
      setTimeout(() => {
        wx.getSystemInfo({
          success: function (res) {
            var v = 750 / res.windowWidth; //获取手机比例
            // let system = res.system
            that.drawPoster(v);
          },
        });
      }, 1000);
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
      console.log(res);
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
    //点击生成海报
    wx.showLoading({
      title: "图片生成中...",
      mask: true,
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
        if (res.data.type == 1) { //送花成功
          let work = that.data.item;
          work.flowers += work.flowers < 10000 ? 1 : 0;
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
            showJump: true
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
  jumpPeper(){
    console.log("跳转")
    //活动弹窗
    let item = this.data.jumpUrl;
    this.closeJump(); //关闭卡片,跳转
    // if (item.jump_type == 1) {
    //   //外连接
    //   wx.navigateTo({
    //     url: `../education/education?type=0&url=${item.clickurl}`,
    //   });
    // } else if (item.jump_type == 2) {
    //   //小程序的tab页
    //   wx.switchTab({
    //     url: item.clickurl,
    //   });
    // } else if (item.jump_type == 4) {
    //   //小程序内的页面
    //   wx.navigateTo({
    //     url: item.clickurl,
    //   });
    // }
    // wx.navigateTo({
    //   url: `../education/education?url=${e.currentTarget.dataset.peper}&type=0}`
    // })
  },
  closeJump(){
    this.setData({
      showJump: flase
    })
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
        switch (data) {
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
    let worksImg = this.data.showImg;
    ctx.drawImage(worksImg, 30 / v, 157 / v, 570 / v, 380 / v);

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
      wx.showToast({
        icon: "none",
        title: "已经到底了哦",
        duration: 1000,
      });
    }
  },
  onShareAppMessage() {
    console.log("分享");
    let item = this.data.item;
    let id = item.id;
    let uid = wx.getStorageSync("userInfo").id;
    let imgUrl = item.image;
    let title = this.data.shareTitle || '好友助力';
    
    return {
      title: title,
      path:
        "/pages/voteArticle/voteArticle?voteid=" +
        id +
        "&type=share&vote=0&uid=" +
        uid, // 路径，传递参数到指定页面。
      imageUrl: imgUrl,
    };
  },
});
