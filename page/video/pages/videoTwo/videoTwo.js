//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    list: [],
    prevideoList: [],
    cur: {},
    tip: true,
    vid: "short-video" + Date.now(),
    autoplay: false,
    showintegral: false,
    isshowRed: false,
    loop: false,
    isshowRedbig: false,
    pause: true,
    nextRtight: 6,
    videoTwo: true
    /*  rect: wx.getMenuButtonBoundingClientRect() */
  },
  pageName: "单用户短视频全部展示页",
  recordVideo_id: -1,
  end: false,
  pre: false,
  onLoad(options) {
    this.videoContext = wx.createVideoContext(this.data.vid);
    wx.setNavigationBarTitle({
      title: options.title
    });
    this.wifi = false;
    /* 从短视频分类页面过来 */
    this.setData({
      limit: true,
    });
    this.param = {
      type: "category",
      id: options.id,
      pageSize: 10,
      position: "first",
      include: "yes",
      categoryId: options.categoryId
    };
    /* 已登录 */
    this.getList([]).then(() => {
      this.setData({
        cur: this.data.list[1],
        index: 0
      });
      app.addVisitedNum(`v${this.data.cur.id}`);
      wx.uma.trackEvent("sortVideo_play", {
        videoName: this.data.cur.title
      });
      this.judgeWifi();
    });
  },
  onShow() {
    if (this.data.list.length == 0) {
      wx.showLoading({
        title: '正在努力加载中'
      })
    } else if (this.data.list.length > 0) {
      this.judgeWifi()
    }
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
      res.data.today_first ?
        "" :
        this.setData({
          loop: true
        });
    });
  },
  //获取红包奖励内容
  recordFinish() {
    let param = {
      shortvideo_id: this.data.cur.id
    };
    if (this.data.cur.id == this.recordVideo_id) return;
    app.video.recordFinish(param).then(res => {
      if (res.data.day_read == 1) {
        app.setIntegral(this, "+2 学分", "每日看完十个短视频");
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
            that.wifi = true;
            that.setData({
              pause: false
            });
          } else {
            that.setData({
              pause: true
            });
            wx.showModal({
              content: "您当前不在Wi-Fi环境，继续播放将会产生流量，是否选择继续播放?",
              confirmText: "是",
              cancelText: "否",
              confirmColor: "#DF2020",
              success(res) {
                if (res.confirm) {
                  app.playVedio("flow");
                  that.setData({
                    pause: false
                  });
                  wx.offNetworkStatusChange();
                } else if (res.cancel) {
                  that.setData({
                    pause: true,
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
    let temp = this.data.list;
    if (this.data.limit) {
      return app.video.category(this.param).then(msg => {
        // return this.getpreList(msg.data.lists).then(res => {
        this.callback(msg, []);
        // })
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
      msg.data.lists.length == 5 ? [msg.data.lists.push(msg.data.lists[3]), msg.data.lists.push(msg.data.lists[4])] : msg.data.lists.length == 4 ? [msg.data.lists.push(msg.data.lists[3]), msg.data.lists.push(msg.data.lists[0])] : ''
      msg.data.lists.forEach(function (item) {
        item.pw = app.util.tow(item.praise);
        item.fw = app.util.tow(item.forward);
      });
      msg.data.lists.length < 10 ? this.end = true : ''
      this.setData({
        list: temp.concat(msg.data.lists || [])
      });
      this.param.last_id = msg.data.last_id;
    }
  },
  tap() {
    if (this.data.pause) {
      this.judgeWifi();
    } else {
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
  onShareAppMessage: function (ops) {
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
        wx.uma.trackEvent('totalShare', {
          shareName: '短视频转发'
        });
      });
      return {
        title: this.data.cur.title,
        path: "/pages/video/video?id=" +
          this.data.cur.id +
          "&type=share" + (this.data.$state.userInfo.id ? "&uid=" +
            this.data.$state.userInfo.id : null)
      };
    }
  },
  // 首页
  tohome() {
    wx.reLaunch({
      url: "/pages/index/index"
    });
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
    let param = {
      shortvideo_id: this.data.cur.id
    };
    app.video.recordAdd(param);
  },
  // 用于数据统计
  onHide() {},
  // 获取用户的微信昵称头像
  onGotUserInfo: function (e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.updateBase(e);
      e.currentTarget.dataset.type ?
        wx.navigateTo({
          url: "/pages/makeMoney/makeMoney"
        }) :
        "";
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
    if (this.end) return
    let list = this.data.list
    this.param.page += 1;
    this.param.position = "first";
    this.param.include = "no";
    this.param.id = list[list.length - 1].id;
    this.setData({
      videoTwo: false
    })
    app.video.category(this.param).then(msg => {
      // msg.data.lists.shift() 
      msg.data.lists.forEach(function (item) {
        item.pw = app.util.tow(item.praise);
        item.fw = app.util.tow(item.forward);
      });
      this.setData({
        list: msg.data.lists
      })
      msg.data.lists.length < 10 ? this.end = true : ''
      this.param.last_id = msg.data.last_id;
    });
  },
  getpreList(list) {
    if (this.pre) return
    this.param.id = list.length > 0 ? list[0].id : this.data.list[0].id;
    this.param.position = "end";
    this.param.include = "no";
    return app.video.category(this.param).then(msg => {
      msg.data.lists.forEach(function (item) {
        item.pw = app.util.tow(item.praise);
        item.fw = app.util.tow(item.forward);
      });
      if (this.data.videoTwo) {
        return [msg.data.lists[msg.data.lists.length - 1]]
      } else {
        this.setData({
          prevideoList: msg.data.lists
        })
      }
      msg.data.lists.length < 10 ? this.pre = true : ''
      this.param.last_id = msg.data.last_id;
    });
  },
  videoTwochange() {
    this.setData({
      videoTwo: false
    })
  },
  showIntegral(e) {
    this.setData({
      integral: `+${e.detail.num} 学分`,
      integralContent: e.detail.txt,
      showintegral: true
    });
    setTimeout(() => {
      this.setData({
        showintegral: false
      });
    }, 2000);
  },
});