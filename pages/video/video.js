//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    list: [],
    cur: {},
    tip: true,
    vid: "short-video" + Date.now(),
    top: 20,
    topT: 0,
    pause: true,
    showGuide: false,
    nextRtight: 1,
    currentTab: 0,
    classify: [],
    autoplay: false,
    guideTxt: "下一步",
    vistor: false,
    showintegral: false,
    isshowRed: false,
    isshowRedbig: false,
    loop: false
    /*  rect: wx.getMenuButtonBoundingClientRect() */
  },
  pageName: "短视频页",
  guide: 0,
  recordfinish: 0,
  vediorecordAdd: 0,
  onLoad(options) {
    let systemInfo = wx.getSystemInfoSync();
    this.wifi = false;
    systemInfo.statusBarHeight < 30
      ? this.setData({
          topT: 118
        })
      : this.setData({
          top: 48,
          topT: 168
        });
    this.videoContext = wx.createVideoContext(this.data.vid);
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
        this.shortvideoAward();
        app.addVisitedNum(`v${this.data.cur.id}`);
        wx.uma.trackEvent("sortVideo_play", { videoName: this.data.cur.title });
      });
      this.getCategory();
    }
    wx.uma.trackEvent("menu", { pageName: "短视频" });
    let share = options.type == "share";
    if (!share) {
      this.setData({
        autoplay: false
      });
    }
    let ap = {
      categoryId: 10,
      page: 1,
      pageSize: 10
    };
  },
  onShow(opts) {
    wx.onNetworkStatusChange(res => {
      res.networkType == "wifi" ? app.playVedio("wifi") : "";
    });
    if (this.data.$state.userInfo.mobile) {
      this.shortvideoAward();
      if (this.data.$state.newGuide) {
        this.data.$state.newGuide.shortvideo != 0
          ? this.judgeWifi()
          : this.setData({
              showGuide: true
            });
      } else {
        app.getGuide().then(res => {
          if (this.data.$state.newGuide.shortvideo != 0) {
            this.judgeWifi();
          } else {
            this.setData({
              showGuide: true
            });
          }
        });
      }
    }
  },
  //获取是否红包奖励
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
    if(this.recordfinish || !this.vediorecordAdd) return
    this.recordfinish = 1
    let param = { shortvideo_id: this.data.cur.id };
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
      this.vediorecordAdd = 0
      wx.nextTick(() => {
        this.vediorecordAdd = 0
        this.recordfinish = 0
      })
    }).catch(() => {
      this.recordfinish = 0
      this.vediorecordAdd = 0
    });
  },
  closeRed() {
    this.setData({
      isshowRedbig: false,
      isshowRed: false
    });
  },
  vedioRecordAdd() {
    wx.hideLoading()
    setTimeout(() => {
      let param = { shortvideo_id: this.data.cur.id }
      app.video.recordAdd(param).then(() => {
        this.vediorecordAdd = 1
      })
    }, 2000) 
  },
  videoError() {
    wx.showToast({
      title: '视频加载出错',
    })
  },
  videoDmetadata() {
    wx.hideLoading()
  },
  copywechat() {
    app.copythat(this.data.wechatnum);
  },
  judgeWifi() {
    if (!this.data.$state.flow && this.data.currentTab == 0) {
      this.setData({
        autoplay: false
      });
      let that = this;
      wx.getNetworkType({
        success: res => {
          if (res.networkType == "wifi") {
            that.wifi = true;
            app.playVedio("wifi");
            that.videoContext.play();
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
            that.wifi = false;
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
                  app.playVedio("wifi");
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
    } else if (this.data.currentTab == 0) {
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
      });
    }
  },
  getCategory() {
    app.video.categoryMore().then(res => {
      this.setData({
        classify: res.data
      });
    });
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
              wx.showLoading({
                title: '努力加载中',
              })
              this.setData({
                cur: this.data.list[data.data.lists.length - 1],
                index: data.data.lists.length - 1,
                pause: false
              });
            }
          }
        });
      } else {
        wx.showLoading({
          title: '努力加载中',
        })
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
          wx.showLoading({
            title: '努力加载中',
          })
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
    // setTimeout(() => {
    //   this.vedioRecordAdd()
    // }, 200);
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
      wx.uma.trackEvent("sortVideo_praise", { videoName: this.data.cur.title });
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
  onShareAppMessage: function(ops) {
    if (ops.from === "menu") {
      return this.menuAppShare();
    }
    if (ops.from === "button") {
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
        wx.uma.trackEvent("sortVideo_share", {
          videoName: this.data.cur.title
        });
        wx.uma.trackEvent('totalShare', { 'shareName': '短视频转发' });
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
    if (this.data.limit) return;
    wx.navigateTo({
      url:
        "/pages/videoItemize/videoItemize?categoryId=" +
        this.data.cur.category_id +
        "&share=" +
        this.data.vistor
    });
  },
  navgateto(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:
        "/pages/videoItemize/videoItemize?categoryId=" +
        id +
        "&share=" +
        this.data.vistor
    });
    wx.uma.trackEvent("sortVideo_index", {
      name: e.currentTarget.dataset.name
    });
  },
  // 完整视频
  complete() {
    let cur = this.data.cur;
    wx.navigateTo({
      url: "../detail/detail?id=" + cur.target_id
    });
  },
  // 用于数据统计
  onHide() {
    setTimeout(() => {
      this.videoContext.stop();
    }, 500);
  },
  //指引
  nextGuide(e) {
    if (this.data.nextRtight == 1) {
      this.setData({
        nextRtight: 2
      });
    } else if (this.data.nextRtight == 2) {
      this.setData({
        nextRtight: 3
      });
    } else if (this.data.nextRtight == 3) {
      this.setData({
        nextRtight: 4,
        guideTxt: "我知道了"
      });
    } else {
      if (this.guide) return;
      this.guide = true;
      let param = {
        guide_name: "shortvideo"
      };
      app.user
        .guideRecordAdd(param)
        .then(res => {
          app.getGuide();
          this.setData({
            nextRtight: 5,
            integral: "+45 学分",
            integralContent: "完成[短视频]新手指引",
            showintegral: true
          });
          setTimeout(() => {
            this.setData({
              showintegral: false
            });
            this.judgeWifi();
          }, 2000);
        })
        .catch(() => {
          this.guide = 0;
          err.msg == '记录已增加' ? app.setState({ 'newGuide.shortvideo': 1 }) : ''
        });
    }
  },
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
  switchNav(event) {
    let cur = event.currentTarget.dataset.current;
    if (this.data.currentTab === cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      });
    }
  },
  switchTab(event) {
    let cur = event.detail.current;
    this.setData({
      currentTab: cur
    });
    cur == 0 ? this.judgeWifi() : this.videoContext.stop();
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
  }
});
