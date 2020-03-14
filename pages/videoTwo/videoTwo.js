//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    list: [],
    cur: {},
    tip: true,
    vid: "short-video" + Date.now(),
    autoplay: false,
    showintegral: false,
    isshowRed: false,
    loop: false,
    isshowRedbig: false
    /*  rect: wx.getMenuButtonBoundingClientRect() */
  },
  pageName: "单用户短视频全部展示页",
  recordVideo_id: -1,
  onLoad(options) {
    this.videoContext = wx.createVideoContext(this.data.vid);
    wx.setNavigationBarTitle({
      title: options.title
    });
    this.wifi = false;
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    if (prePage && prePage.route == "pages/videoItemize/videoItemize") {
      /* 从短视频分类页面过来 */
      this.setData({
        limit: true,
        home: options.home == "true"
      });
      this.param = {
        type: "category",
        id: options.id,
        pageSize: 10,
        position: "first",
        include: "yes",
        categoryId: options.categoryId
      };
    } else {
      /* 短视频推荐 */
      let share = options.type == "share";
      this.setData({
        vistor: share
      });
      /* 分享卡片进来,提示持续15秒 */
      if (share) {
        setTimeout(() => {
          this.setData({
            tip: false
          });
        }, 5000);
      }
      this.param = {
        type: "recommend",
        id: options.id ? options.id : "",
        page: 1,
        pageSize: 10,
        last_id: ""
      };
    }

    if (this.data.$state.userInfo.mobile) {
      /* 已登录 */
      this.getList([]).then(() => {
        this.setData({
          cur: this.data.list[0],
          index: 0
        });
        app.addVisitedNum(`v${this.data.cur.id}`);
        wx.uma.trackEvent("sortVideo_play", { videoName: this.data.cur.title });
        this.judgeWifi();
      });
    }
  },
  onShow() {
    this.shortvideoAward();
    wx.onNetworkStatusChange(res => {
      res.networkType == "wifi" ? app.playVedio("wifi") : "";
    });
  },
  shortvideoAward() {
    return app.video.shortvideoAward().then(res => {
      this.setData({
        isshowRed: res.data.today_first
      });
      res.data.today_first
        ? ""
        : this.setData({
            loop: true
          });
    });
  },
  //获取红包奖励内容
  recordFinish() {
    let param = { shortvideo_id: this.data.cur.id };
    if (this.data.cur.id == this.recordVideo_id) return;
    app.video.recordFinish(param).then(res => {
      if (res.data.day_read == 1) {
        this.setData({
          integral: "+100 学分",
          integralContent: "每日看完十个短视频",
          showintegral: true
        });
        setTimeout(() => {
          this.setData({
            showintegral: false
          });
        }, 2000);
      }
      this.setData({
        loop: true,
        isshowRedbig: res.data.today_award,
        wechatnum: res.data.wechat_num
      });
      this.videoContext.play();
    });
  },
  closeRed() {
    this.setData({
      isshowRedbig: false,
      isshowRed: false
    });
  },
  showred() {
    this.videoContext.stop();
    wx.showModal({
      content: "观看完整短视频即可有机会领取现金红包哦！",
      confirmText: "继续观看",
      confirmColor: "#df2020",
      success: res => {
        this.data.$state.flow || this.wifi ? this.videoContext.play() : "";
      },
      fail: res => {
        this.data.$state.flow || this.wifi ? this.videoContext.play() : "";
      }
    });
  },
  judgeWifi() {
    if (!this.data.$state.flow) {
      this.setData({
        autoplay: false
      });
      let that = this;
      wx.getNetworkType({
        success: res => {
          if (res.networkType == "wifi") {
            app.playVedio("wifi");
            that.videoContext.play();
            that.wifi = true;
            that.setData({
              autoplay: true,
              pause: false
            });
          } else {
            that.videoContext.pause();
            that.setData({
              autoplay: false,
              pause: true
            });
            wx.showModal({
              content:
                "您当前不在Wi-Fi环境，继续播放将会产生流量，是否选择继续播放?",
              confirmText: "是",
              cancelText: "否",
              confirmColor: "#DF2020",
              success(res) {
                if (res.confirm) {
                  app.playVedio("flow");
                  that.setData({
                    autoplay: true,
                    pause: false
                  });
                  that.videoContext.play();
                  wx.offNetworkStatusChange();
                } else if (res.cancel) {
                  that.videoContext.pause();
                  that.setData({
                    pause: true,
                    autoplay: false
                  });
                }
              }
            });
          }
        }
      });
    } else {
      this.setData({
        pause: false,
        autoplay: true
      });
      this.videoContext.play();
    }
  },
  getList(list) {
    let temp = list || this.data.list;
    if (this.data.limit) {
      return app.video.category(this.param).then(msg => {
        this.callback(msg, temp);
        return msg;
      });
    } else {
      return app.video.list(this.param).then(msg => {
        this.callback(msg, temp);
        return msg;
      });
    }
  },
  callback(msg, temp) {
    if (msg.code === 1 && msg.data && msg.data.lists) {
      msg.data.lists.forEach(function(item) {
        item.pw = app.util.tow(item.praise);
        item.fw = app.util.tow(item.forward);
      });

      this.setData({
        list:
          this.param.position == "end"
            ? (msg.data.lists || []).concat(temp)
            : temp.concat(msg.data.lists || [])
      });
      this.param.last_id = msg.data.last_id;
    }
  },
  tap() {
    if (this.data.pause) {
      this.judgeWifi();
      this.setData({
        pause: false
      });
    } else {
      this.videoContext.pause();
      this.setData({
        pause: true
      });
    }
  },
  scrollTouchStart(e) {
    this.sy = e.touches[0].pageY;
  },
  scrollTouchEnd(e) {
    let list = this.data.list;
    let index = this.data.index;
    this.ey = e.changedTouches[0].pageY;
    if (this.ey - this.sy > 30) {
      // 下拉

      if (this.param.type == "category" && index == 0) {
        this.param.id = list[0].id;
        this.param.position = "end";
        this.param.include = "no";
        this.getList().then(data => {
          if (data.data && data.data.lists) {
            if (data.data.lists.length == 0) {
              /*  已经是第一个了  */
            } else if (data.data.lists.length > 0) {
              this.setData({
                cur: this.data.list[data.data.lists.length - 1],
                index: data.data.lists.length - 1,
                pause: false
              });
            }
          }
        });
      } else {
        this.setData({
          cur: index <= 0 ? list[0] : list[index - 1],
          index: index <= 0 ? 0 : index - 1,
          pause: false
        });
      }
    } else if (this.ey - this.sy < -30) {
      // 上拉
      let temp =
        index >= list.length - 1
          ? this.param.type == "recommend"
            ? 0
            : index
          : index + 1;
      this.setData({
        cur: list[temp],
        index: temp,
        pause: false
      });
      if (temp == list.length - 2) {
        //还剩下一个视频时,加载新数据
        if (this.param.type == "recommend") {
          this.param.page += 1;
          this.param.id = "";
        } else {
          this.param.id = list[list.length - 1].id;
          this.param.position = "first";
          this.param.include = "no";
        }
        this.getList();
      }
    }
    app.addVisitedNum(`v${this.data.cur.id}`);
    wx.uma.trackEvent("sortVideo_play", { videoName: this.data.cur.title });
  },
  praise() {
    let list = this.data.list;
    let index = this.data.index;
    let param1 = {
      id: list[index].id
    };
    if (list[index].praised == 1) {
      // 取消点赞
      app.video.delPraise(param1).then(msg => {
        list[index].praised = 0;
        list[index].praise--;
        this.setData({
          list: list,
          cur: list[index]
        });
      });
    } else {
      // 点赞
      app.video.praise(param1).then(msg => {
        if (msg.data.is_first == "first") {
          this.setData({
            integral: "+50 学分",
            integralContent: "完成[短视频]首次点赞",
            showintegral: true
          });
          setTimeout(() => {
            this.setData({
              showintegral: false
            });
          }, 2000);
        } else if (msg.data.is_first == "day") {
          this.setData({
            integral: "+20 学分",
            integralContent: "完成每日[短视频]首赞",
            showintegral: true
          });
          setTimeout(() => {
            this.setData({
              showintegral: false
            });
          }, 2000);
        }
        list[index].praised = 1;
        list[index].praise++;
        list[index].praising = true;
        this.setData({
          list: list,
          cur: list[index]
        });
      });
      wx.uma.trackEvent("sortVideo_play", { videoName: this.data.cur.title });
    }
  },
  aniend(e) {
    let list = this.data.list;
    let index = this.data.index;
    list[index].praising = false;
    this.setData({
      list: list,
      cur: list[index]
    });
  },
  // 转发
  onShareAppMessage: function(ops) {
    if (ops.from === "menu") {
      return this.menuAppShare();
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button");
      let list = this.data.list;
      let index = this.data.index;
      let param2 = {
        id: list[index].id
      };
      app.video.share(param2).then(msg => {
        list[index].forward += 1;
        this.setData({
          list: list,
          cur: list[index]
        });
        wx.uma.trackEvent("sortVideo_play", {
          videoName: this.data.cur.title
        });
      });
      return {
        title: list[index].title,
        path:
          "/pages/video/video?id=" +
          list[index].id +
          "&type=share&uid=" +
          this.data.$state.userInfo.id
      };
    }
  },
  // 首页
  tohome() {
    wx.reLaunch({ url: "/pages/index/index" });
  },
  // 短视频分类
  navigate() {
    /* 只能迭代一层 */
    wx.navigateBack({});
  },
  // 完整视频
  complete() {
    let cur = this.data.cur;
    wx.navigateTo({
      url: "../detail/detail?id=" + cur.target_id
    });
  },
  vedioRecordAdd() {
    let param = { shortvideo_id: this.data.cur.id };
    app.video.recordAdd(param);
  },
  // 用于数据统计
  onHide() {},
  // 获取用户的微信昵称头像
  onGotUserInfo: function(e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.updateBase(e);
      e.currentTarget.dataset.type
        ? wx.navigateTo({
            url: "/pages/makeMoney/makeMoney"
          })
        : "";
    }
  },
  onUnload() {},
  copywechat() {
    app.copythat(this.data.wechatnum);
  }
});
