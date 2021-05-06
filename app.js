/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: wjl
 * @LastEditTime: 2021-04-15 16:20:47
 */
import {
  wxp
} from "./utils/service";
import {
  uma
} from "umtrack-wx";
/* 全局状态管理 */
import store from "./store";
/* sse */
const socket = require("data/socket.js");
const backgroundAudioManager = wx.getBackgroundAudioManager();
//工具库
var util = require("utils/util.js");
// 神策数据监测SDK
var sensors = require("./utils/sensorsdata.min.js");
//http请求接口
var classroom = require("data/Classroom.js"); //PHP空中课堂接口
var user = require("data/User.js"); // 个人信息接口
var video = require("data/Video.js"); // 短视频接口
var circle = require("data/Circle.js"); // 秀风采/同学圈接口
var lottery = require("data/Lottery.js"); // 奖品接口
var tutor = require("data/Tutor.js"); // 收徒接口
var vote = require("data/Vote.js"); //票选活动接口
var activity = require("data/Activity.js"); //活动接口
var liveData = require("data/LiveData.js"); //直播接口
var lessonNew = require("data/lessonNew.js"); // 新课程接口
var study = require("data/studyCenter.js"); //学习中心接口
//app.js
App({
  API_URL: store.API_URL,
  API_URLBASECHECK: store.API_URLBASECHECK,
  //工具库
  util,
  //http请求接口
  classroom,
  user,
  video,
  circle,
  lottery,
  tutor,
  vote,
  activity,
  liveData,
  study,
  socket,
  lessonNew,
  store,
  backgroundAudioManager,
  umengConfig: {
    /*埋点统计*/
    appKey: store.process == "develop" ?
      "5e4cad07eef38d3632042549" : "5e4cd613e1367a268d56bfa2", //由友盟分配的APP_KEY
    useOpenid: false, // 是否使用openid进行统计，此项为false时将使用友盟+随机ID进行用户统计。使用openid来统计微信小程序的用户，会使统计的指标更为准确，对系统准确性要求高的应用推荐使用OpenID。
    autoGetOpenid: false, // 是否需要通过友盟后台获取openid，如若需要，请到友盟后台设置appId及secret
    debug: false, //是否打开调试模式
  },
  onLaunch: async function (opts) {
    if(opts.scene == 1036 || opts.scene == 1069) {
      store.setState({
        showApp: true
      })
    }
    this.getSecureToken();
    let optsStr = decodeURIComponent(opts.query.scene).split("&");
    let opstObj = {};
    optsStr.forEach((item, index) => {
      opstObj[item.split("=")[0]] = item.split("=")[1];
    });
    this.checkVersion();
    /* 检查用户从分享卡片启动 */
    if (this.globalData.scenes.indexOf(opts.scene) >= 0) {
      this.globalData.path = "/" + opts.path; /* 卡片页面路径 */
      this.globalData.query = opts.query; /* 卡片页面参数 */
      this.globalData.shareObj = opstObj;
      this.globalData.lotteryId = opstObj.id;
      if (
        opts.query.type == "invite" ||
        opts.query.type == "share" ||
        opstObj.type == "invite" ||
        opstObj.type == "lottery" ||
        opts.query.type == "lottery" ||
        opstObj.t >= 0
      ) {
        if (opts.query.uid) {
          wx.setStorageSync("invite", opts.query.uid); /* 邀请码记录 */
          wx.setStorageSync("goosId", opts.query.id);
        } else if (opstObj.uid) {
          wx.setStorageSync("invite", opstObj.uid); /* 邀请码记录 */
          wx.setStorageSync("goosId", opstObj.id);
        } else {
          wx.setStorageSync("invite", opstObj.u); /* 邀请码记录 */
        }
      }
    }
    let userInfo = wx.getStorageSync("userInfo") || {};
    let mpVersion = wx.getStorageSync("mpVersion");
    let systemInfo = wx.getSystemInfoSync();
    let wxtype = systemInfo.version.replace(".", "").replace(".", "");
    let platform = systemInfo.platform;
    if (
      platform == "windows" ||
      platform == "mac" ||
      platform == "macOS" ||
      platform == "devtools"
    ) {
      this.playVedio("flow");
    }
    if (wxtype < 606) {
      //微信版本过低提示用户更新版本
      wx.reLaunch({
        url: "/pages/upwxpage/upwxpage",
      });
    } else if (opstObj.p) {
      // 初次启动进入活动
      wx.reLaunch({
        url: `/page/vote/pages/voteArticle/voteArticle?voteid=${opstObj.o}&uid=${opstObj.u}`,
      });
    }
    /* storage中信息缺失,重新登录 */
    if (
      !userInfo.mobile ||
      !userInfo.openid ||
      mpVersion != this.store.mpVersion
    ) {
      if (opts.path != "pages/index/index" && !(this.globalData.unLoginPage.indexOf(opts.path) >= 0)) {
        wx.reLaunch({
          url: "/pages/index/index",
          success: () => {
            if (this.globalData.path != "/pages/index/index") {
              wx.showLoading({
                title: "正在努力加载中",
              });
            }
          },
        });
      }
      await this.wxLogin();
      wx.setStorageSync("mpVersion", this.store.mpVersion);
    }
    this.initStore();
  },
  onShow: function (opts) {
    console.log(opts, "进入");
    if(opts.scene == 1036 || opts.scene == 1069) {
      store.setState({
        showApp: true
      })
    }
    let optsStr = decodeURIComponent(opts.query.scene).split("&");
    let opstObj = {};
    optsStr.forEach((item, index) => {
      opstObj[item.split("=")[0]] = item.split("=")[1];
    });
    let lists = ["share", "invite"];
    /* 小程序(在后台运行中时)从分享卡片切到前台 */
    console.log(this.globalData.backstage);
    if (this.globalData.backstage) {
      this.globalData.backstage = false;
      this.socket.backstage();
      if (
        this.globalData.scenes.indexOf(opts.scene) >= 0 &&
        lists.indexOf(opts.query.type) >= 0
      ) {
        this.globalData.path = "/" + opts.path; /* 卡片页面路径 */
        this.globalData.query = opts.query; /* 卡片页面参数 */
        if (
          opts.query.type == "invite" ||
          opts.query.type == "share" ||
          opts.type == "lottery"
        ) {
          wx.setStorageSync("invite", opts.query.uid); /* 邀请码存储 */
        }
      }
      if (opts.type == "lottery") {
        wx.reLaunch({
          url: "/pages/education/education?type=lottery&login=1",
        });
      }
      if (
        opts.path == "pages/education/education" &&
        !this.store.$state.userInfo.id
      ) {
        setTimeout(() => {
          this.changeLoginstatus();
          let params = {
            type: "education",
            detail: JSON.stringify(this.globalData.query),
          };
          this.checknextTap(params, 1);
        }, 1500);
      }
    }
    if (this.store.$state.userInfo.id) {
      // socket启动
      setTimeout(() => {
        socket.init(this.store.$state.userInfo.id);
        socket.listen(this.prizemessage, "Prizemessage");
        socket.listen(this.bokemessage, "Bokemessage");
      }, 2000);
    } else {
      //从后台返回前台路由守卫
      if (opts.path == "pages/index/index") return;
      if (this.globalData.unLoginPage.indexOf(opts.path) >= 0) return;
      wx.reLaunch({
        url: "/pages/index/index",
      });
    }
    this.getSets();
  },
  onHide() {
    this.globalData.backstage = true;
    if (this.store.$state.userInfo.id) {
      socket.close();
    }
  },
  onError: function (err) {},
  wxLogin: async function (e) {
    await wxp.login({}).then((res) => {
      if (res.code) {
        this.globalData.code = res.code;
        console.log("wxCode", res.code);
      } else {
        console.log("wx.login登录失败！" + res.errMsg);
      }
    });
    await this.user
      .wxLoginCode({
        code: this.globalData.code,
      })
      .then((msg) => {
        if (!msg.data.userInfo) {
          wx.hideLoading();
          /* 新用户未注册 */
          this.globalData.loginDetail = msg.data;
          if (this.globalData.path == "/pages/education/education") {
            setTimeout(() => {
              this.changeLoginstatus();
              let params = {
                type: "education",
                detail: JSON.stringify(this.globalData.query),
              };
              this.checknextTap(params, 1);
            }, 1500);
          }
        } else {
          /* 旧用户 */
          wx.hideLoading();
          wx.setStorageSync("token", msg.data.token);
          wx.setStorageSync("uid", msg.data.uid);
          wx.setStorageSync("authKey", msg.data.authKey);
          e ? this.updateBase(e) : this.setUser(msg.data.userInfo);
          if (this.globalData.path == "/pages/education/education") {
            wx.navigateTo({
              url: `/pages/education/education?url=${this.globalData.query.url}&type=0&login=1`,
            });
          } else {
            wx.navigateTo({
              url: `${this.globalData.path}?${JSON.stringify(
                this.globalData.query
              )
                .replace("{", "")
                .replace("}", "")
                .replace(":", "=")
                .replace(/\"/g, "")
                .replace(/\,/g, "&")}`,
            });
          }
        }
      });
  },
  sensorsInit() {
    if (store.process == "dev") return;
    sensors.setOpenid(store.$state.userInfo.openid);
    sensors.login(store.$state.userInfo.id);
    sensors.registerApp({
      from: `wslndx-${store.process}`,
    });
    sensors.init();
    sensors.setPara({
      name: "wslndxMiniTest",
      server_url: "https://jinlingkeji.datasink.sensorsdata.cn/sa?project=default&token=4f0021310a3bc4f0",
      // 全埋点控制开关
      autoTrack: {
        appLaunch: true, // 默认为 true，false 则关闭 $MPLaunch 事件采集
        appShow: true, // 默认为 true，false 则关闭 $MPShow 事件采集
        appHide: true, // 默认为 true，false 则关闭 $MPHide 事件采集
        pageShow: true, // 默认为 true，false 则关闭 $MPViewScreen 事件采集
        pageShare: true, // 默认为 true，false 则关闭 $MPShare 事件采集
        mpClick: true, // 默认为 false，true 则开启 $MPClick 事件采集
        mpFavorite: true, // 默认为 true，false 则关闭 $MPAddFavorites 事件采集
      },
      source_channel: [],
      show_log: false,
      allow_amend_share_path: true,
    });
  },
  /* 初始化store */
  initStore: function () {
    let sign = wx.getStorageSync("signStatus") || {};
    if (sign.time !== new Date().toDateString()) {
      sign = {
        status: false,
        count: 0,
      };
    }
    this.store.setState({
      visitedNum: wx.getStorageSync("visitedNum") || [],
      userInfo: wx.getStorageSync("userInfo") || {},
      authKey: wx.getStorageSync("authKey") || "",
      signStatus: sign,
    });
    this.getSets();
    this.sensorsInit();
  },
  /* 更新store中的userInfo */
  setUser: function (data) {
    let areaArray = data.universityName ? data.universityName.split(",") : "";
    if ((!data.address || !data.school) && areaArray.length == 3) {
      data.address = areaArray.slice(0, 2);
      data.addressCity = areaArray[1];
      data.school = areaArray[2];
    }
    this.store.setState({
      userInfo: data,
    });
    // this.sensorsInit();
    wx.setStorageSync("userInfo", data);
    if (data.id) {
      socket.close();
      socket.init(data.id);
      socket.listen(this.prizemessage, "Prizemessage");
      socket.listen(this.bokemessage, "Bokemessage");
    }
    getCurrentPages().forEach((e) => {
      e.route == "pages/index/index" ?
        this.store.$state.nextTapDetial.type == "addStudy" ?
        e.init(1) :
        e.init() :
        "";
    });
  },
  /* 更新AuthKey 上传视频*/
  setAuthKey: function (data) {
    this.store.setState({
      authKey: data,
    });
    wx.setStorageSync("authKey", data);
  },
  /* 更新转发分享 */
  setShare: function (data) {
    this.store.setState({
      shareImgurl: data.data.img_url,
      shareTitle: data.data.title,
    });
  },
  /* 更新store中的用户授权  */
  getSets: function () {
    let auth = wx.getStorageSync("scopUserInfo");
    let self = this;
    wx.getSetting({
      withSubscriptions: true,
      success: (res) => {
        if (res.errMsg == "getSetting:ok") {
          // let auth = res.authSetting["scope.userInfo"];
          self.store.setState({
            authUserInfo: auth || false,
            baseInfo: !auth && self.store.$state.visitedNum.length > 10,
            subscript: res.subscriptionsSetting.mainSwitch,
            itemSettings: res.subscriptionsSetting.itemSettings
            // authUserInfo: 1,
            // baseInfo: 0
          });
        }
        let record = res.authSetting["scope.record"];
        self.store.setState({
          authRecord: record || false,
        });
      },
    });
  },
  /* 更新store中的用户免费查看的视频数目 */
  addVisitedNum: function (id) {
    if (!id) return;
    let arr = this.store.$state.visitedNum;
    if (!this.store.$state.authUserInfo && arr.indexOf(id) == -1) {
      arr.push(id);
      this.store.setState({
        visitedNum: arr,
        baseInfo: arr.length > 10,
      });
      wx.setStorageSync("visitedNum", arr);
    }
  },
  /* 授权更新数据库及store中的用户信息 */
  updateBase(e) {
    if (e.errMsg != "getUserProfile:ok") {
      return;
    }
    wx.setStorageSync("scopUserInfo", "true");
    this.getSets();
    let param = {
      userInfo: e.userInfo,
      // encryptedData: e.detail.encryptedData,
      // iv: e.detail.iv,
    };
    this.user
      .profile(param)
      .then((msg) => {
        this.setUser(msg.data.userInfo);
      })
      .catch((msg) => {
        if (msg.status == 401) {
          this.wxLogin(e);
        }
      });
  },
  playVedio(type) {
    type == "wifi" ?
      "" :
      this.store.setState({
        flow: true,
      });
  },
  /* 更新签到信息 */
  setSignIn(data, bl) {
    /* 每天只显示一次签到弹窗 */
    this.store.setState({
      signStatus: data,
    });

    !!bl &&
      wx.setStorage({
        key: "signStatus",
        data: {
          time: new Date().toDateString(),
          status: data.status,
          count: data.count,
        },
      });
  },
  /* 获取用户openid */
  getUserOpenData() {
    this.user.getUserOpenData().then((res) => {
      this.store.setState({
        openId: res.data.openid,
      });
      wx.setStorage({
        data: res.data.openid,
        key: "openId",
      });
    });
  },
  /* 版本检测 */
  checkVersion: function () {
    let systemInfo = wx.getSystemInfoSync();
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: "更新提示",
              content: "新版本已经准备好，请重启应用？",
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate();
                } else {
                  wx.showModal({
                    title: "温馨提示",
                    content: "为了保障您的信息安全, 请点击进行系统更新",
                    showCancel: false, //隐藏取消按钮
                    confirmText: "确定更新", //只保留确定更新按钮
                    success: function (res) {
                      updateManager.applyUpdate();
                    },
                  });
                }
              },
            });
          });
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~",
            });
          });
        }
      });
    }
  },
  /* 接收秀风采socket消息 */
  bokemessage(res) {
    let {
      num = 0, avatar
    } = JSON.parse(res.data).data;
    this.store.setState({
      unRead: num,
      surPass: num > 99,
      lastMan: avatar,
    });
  },
  /* 接收抽奖消息 */
  prizemessage(res) {
    let phoneList = JSON.parse(res.data);
    this.store.setState({
      phoneList: phoneList.data,
    });
  },
  onPageNotFound() {
    wx.reLaunch({
      url: "/pages/index/index",
    });
  },
  /* 获取新手指引 */
  getGuide() {
    if (this.store.$state.userInfo.mobile) {
      return this.user.guideRecord().then((res) => {
        let newGuide = res.data;
        this.store.setState({
          newGuide,
        });
      });
    }
  },
  /* 获取任务状态 */
  getTaskStatus: async function () {
    await this.user.getNewTaskStatus().then((res) => {
      this.store.setState({
        taskStatus: res.data,
      });
    });
    await this.user.getDayTaskStatus().then((res) => {
      this.store.setState({
        dayStatus: res.data,
      });
    });
  },
  /*长按复制内容 */
  copythat(e) {
    wx.setClipboardData({
      data: e,
      success(res) {
        wx.getClipboardData({
          success(res) {
            wx.showToast({
              title: "内容复制成功",
              icon: "none",
              duration: 3000,
            });
          },
        });
      },
    });
  },
  withdrawShare(ops) {
    wx.uma.trackEvent("totalShare", {
      shareName: "我的邀请",
    });
    return {
      title: "一起来网上老年大学学习",
      path: "/pages/index/index?uid=" +
        this.store.$state.userInfo.id +
        "&type=invite&activity=1",
      imageUrl: "https://hwcdn.jinlingkeji.cn/images/dev/withdrawShareImg2.png",
    };
  },
  getSecureToken() {
    setTimeout(() => {
      circle.getSecureToken().then((res) => {
        this.store.setState({
          security: res.data.credential,
        });
      });
    }, 1000);
  },
  /* 更改登录弹框状态 */
  changeLoginstatus() {
    this.store.setState({
      showLogin: !this.store.$state.showLogin,
    });
  },
  /* 更新登录后操作 */
  checknextTap(e, type) {
    if (!type) {
      this.store.setState({
        "nextTapDetial.type": e.currentTarget.dataset.type,
        "nextTapDetial.detail": e.currentTarget.dataset.detail ?
          e.currentTarget.dataset.detail : e,
        "nextTapDetial.funname": e.currentTarget.dataset.funname ? e.currentTarget.dataset.funname : null
      });
    } else {
      this.store.setState({
        "nextTapDetial.type": e.type,
        "nextTapDetial.detail": e.detail,
      });
    }
  },
  /* 积分动画 */
  setIntegral(that, integral, integralContent, type) {
    that.setData({
      integral,
      integralContent,
      showintegral: true,
    });
    setTimeout(() => {
      that.setData({
        showintegral: false,
      });
      if (type) {
        // 消失后跳转学分页面(携带name和积分num)
        let num = this.store.$state.signdays == 7 ? 50 : 2;
        wx.navigateTo({
          url: `/page/user/pages/score/score?name=home&num=${num}`,
        });
      }
    }, 2000);
  },
  /* 专栏跳转判断 */
  liveAddStatus(columnId, isCharge, scoreId) {
    if (isCharge == 1) {
      wx.navigateTo({
        url: `/page/index/pages/chageLesson/chageLesson?id=${columnId}`,
      });
    } else {
      liveData
        .getLiveBySpecialColumnId({
          specialColumnId: columnId,
        })
        .then((res) => {
          if (!res.data.isAddSubscribe) {
            wx.navigateTo({
              url: "/page/live/pages/tableDetail/tableDetail?specialColumnId=" +
                columnId +
                (scoreId ? `&scroeId=${scoreId}` : ""),
            });
          } else {
            wx.navigateTo({
              url: "/page/live/pages/liveDetail/liveDetail?specialColumnId=" +
                columnId +
                (scoreId ? `&scroeId=${scoreId}` : ""),
            });
          }
        });
    }
  },
  /* 订阅消息授权 */
  subscribeMessage: async function (liveId, that, func) {
    let page = getCurrentPages()[getCurrentPages().length - 1],
      settingReject = 0,
      reject = 0,
      Box = null,
      itemSettings = store.$state.itemSettings || null
    if (store.$state.subscript) {
      let reserveList = (await liveData.getTemplate()).data.map((item) => {
        return item.priTmplId;
      });
      if (itemSettings) {
        reserveList.forEach(item => {
          itemSettings[item] == 'reject' ? settingReject += 1 : ''
        })
      }
      let openid = (await user.myIndex()).data.has_mp_openid,
        showReserveBox = !(itemSettings && settingReject != reserveList.length)
      page.setData({
          showReserveBox,
        },
        () => {
          if (!showReserveBox) return
          Box = page.selectComponent("#reserveBox");
          if (settingReject == reserveList.length) Box.setData({
            showSetting: true,
          });
        }
      );
      wx.requestSubscribeMessage({
        tmplIds: reserveList,
        success: async function (res) {
          reserveList.forEach((item) => {
            res[item] == "reject" ? (reject = reject += 1) : "";
          });
          if (settingReject == reserveList.length) return
          if (reject == reserveList.length) {
            Box.setData({
              showReserveBox: true,
            });
          } else {
            page.setData({
              showReserveBox: false,
            });
            if (!openid) {
              wx.showToast({
                title: "订阅成功",
                icon: "none",
                duration: 5000,
              });
              wx.navigateTo({
                url: "/pages/education/education?type=sign&url=https://globalh5pro.jinlingkeji.cn/Authorization/#/",
                success() {
                  page.isAdd = 1
                }
              });
            } else {
              wx.showToast({
                title: "课程通知订阅成功",
                icon: "none",
              });
              if (that) {
                that[func]()
              }
            }
            showReserveBox ? Box.setData({
              showReserveBox: false,
              showSetting: false,
            }) : ''
            if (liveId) {
              await liveData.liveReserve({
                liveId,
              });
              page.setData({
                "liveDetail.reserveStatus": 1,
              });
            }
          }
        },
        fail(res) {
          console.log(res, "fail");
          page.setData({
            showReserveBox: false,
          });
        },
      });
    } else {
      page.setData({
          showReserveBox: true,
        },
        () => {
          Box = page.selectComponent("#reserveBox");
          Box.setData({
            showSetting: true,
          });
        }
      );
    }
    this.getSets()
  },
  globalData: {
    /*wx.login 返回值 code */
    code: null,
    /* 新用户临时code */
    tempCode: null,
    logindetail: {},
    /* 卡片路径 */
    path: null,
    /* 卡片参数 */
    query: {},
    /* 卡片进入的场景值 */
    scenes: [1001, 1007, 1008, 1047, 1048, 1049, 1037, 1035, 1074, 1069],
    /* 后台模式*/
    backstage: false,
    rlSuc: false,
    path: "index",
    currentTab: 0,
    detail: {
      id: 0,
      likestatus: 0,
    },
    phoneList: [],
    lottery: "",
    shareObj: {
      type: 0,
    },
    uma,
    categoryId: 0,
    scorePage: false,
    unLoginPage: [
      'pages/search/search',
      'pages/video/video',
      'pages/studyCenter/studyCenter',
      'pages/post/post',
      'pages/user/user',
      'pages/cDetail/cDetail',
      'page/discoveryHall/pages/index/index',
      "page/index/pages/allSchoollesson/allSchoollesson",
      'page/index/pages/schoolLesson/schoolLesson',
      'page/index/pages/detail/detail',
      'page/index/pages/topTeacher/topTeacher',
      'page/index/pages/tearcherDetail/tearcherDetail',
      'page/live/pages/tableDetail/tableDetail',
      'page/live/pages/liveDetail/liveDetail',
      'page/live/pages/vliveRoom/vliveRoom',
      'page/live/pages/hliveRoom/hliveRoom',
      'page/live/pages/timetableList/timetableList',
      'page/user/pages/makeMoney/makeMoney',
      'page/post/pages/pDetail/pDetail',
      'page/post/pages/personPage/personPage'
    ]
  },
});