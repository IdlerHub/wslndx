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
    isshowRedbig: false,
    pause: true,
    nextRtight: 6
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
  getCur(e) {
    app.addVisitedNum(`v${e.detail.id}`);
    this.setData({
      cur: e.detail
    })
  },
  // 转发
  onShareAppMessage: function(ops) {
    if (ops.from === "menu") {
      return this.menuAppShare();
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button");
      let param2 = {
        id: this.data.cur.id
      };
      app.video.share(param2).then(msg => {
        this.selectComponent('#videoSwiper').addShare(this.data.cur.id)
        wx.uma.trackEvent("sortVideo_play", {
          videoName: this.data.cur.title
        });
        wx.uma.trackEvent('totalShare', { 'shareName': '短视频转发' });
      });
      return {
        title: this.data.cur.title,
        path: "/pages/video/video?id=" +
          this.data.cur.id +
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
  },
  videoError() {
    wx.showToast({
      title: '视频加载出错',
    })
  },
  getMorelist() {
    // this.param.page += 1;
    // this.param.id = "";
    // app.video.list(this.param).then(msg => {
    //   msg.data.lists.forEach(function (item) {
    //     item.pw = app.util.tow(item.praise);
    //     item.fw = app.util.tow(item.forward);
    //   });
    //   this.setData({
    //     list: msg.data.lists
    //   })
    //   this.param.last_id = msg.data.last_id;
    // });
  },
});
