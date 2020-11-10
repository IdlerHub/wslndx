/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: wjl
 * @LastEditTime: 2020-07-30 09:34:25
 */
import { wxp } from "./utils/service";
import { uma } from "umtrack-wx";
/* 全局状态管理 */
import store from "./store";
// const vodwxsdk = require('vod-wx-sdk-v2')
/* sse */
const socket = require("data/socket.js");
const backgroundAudioManager = wx.getBackgroundAudioManager()
/* 小程序直播组件 */
var livePlayer = requirePlugin("live-player-plugin");
/* 接入bug平台 */
var fundebug = require("fundebug-wxjs");
fundebug.init({
  apikey: "b3b256c65b30a1b0eb26f8d9c2cd7855803498f0c667df934be2c72048af93d9",
  releaseStage: store.process,
  monitorMethodCall: true /* 自定义函数的监控 */,
  monitorMethodArguments: true /* 监控小程序中的函数调用的参数 */,
  monitorHttpData: true /* 收集 HTTP 请求错误的 body  */,
  setSystemInfo: true,
  silentInject: true,
  filters: [
    {
      req: {
        url: /log\.aldwx\.com/,
        method: /^GET$/,
      },
    },
    {
      req: {
        url: /recordFinish/,
        method: /^POST$/,
      },
    },
    {
      req: {
        url: /lists/,
        method: /^POST$/,
      },
    },
    {
      error: /getHistory/,
    },
    {
      errMsg: / request:fail timeout | uploadFile:ok | request:fail | request:ok /,
    },
  ],
  metaData: {
    storeData: store.$state,
  },
});
//工具库
var util = require("utils/util.js");
//http请求接口
var classroom = require("data/Classroom.js");
var user = require("data/User.js");
var video = require("data/Video.js");
var circle = require("data/Circle.js");
var lottery = require("data/Lottery.js");
var tutor = require("data/Tutor.js");
var vote = require("data/Vote.js"); //票选活动接口
var activity = require("data/Activity.js");
var liveData = require("data/LiveData.js");
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
  socket,
  store,
  fundebug,
  livePlayer,
  backgroundAudioManager,
  umengConfig: {
    appKey:
      store.process == "develop"
        ? "5e4cad07eef38d3632042549"
        : "5e4cd613e1367a268d56bfa2", //由友盟分配的APP_KEY
    useOpenid: false, // 是否使用openid进行统计，此项为false时将使用友盟+随机ID进行用户统计。使用openid来统计微信小程序的用户，会使统计的指标更为准确，对系统准确性要求高的应用推荐使用OpenID。
    autoGetOpenid: false, // 是否需要通过友盟后台获取openid，如若需要，请到友盟后台设置appId及secret
    debug: false, //是否打开调试模式
  },
  /*埋点统计*/
  onLaunch: async function (opts) {
    console.log(opts, this.globalData.scenes.indexOf(opts.scene) >= 0)
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
      livePlayer
        .getShareParams()
        .then((res) => {
          // 开发者在跳转进入直播间页面时，页面路径上携带的自定义参数，这里传回给开发者
          console.log("get custom params", res.custom_params);
          res.custom_params
            ? [
                wx.setStorageSync("invite", res.custom_params.uid),
                (this.globalData.shareObj = res.custom_params),
              ]
            : "";
        })
        .catch((err) => {
          console.log("get share params", err);
        });
    }
    let userInfo = wx.getStorageSync("userInfo") || {};
    let mpVersion = wx.getStorageSync("mpVersion");
    /* storage中信息缺失,重新登录 */
    if (!userInfo.mobile || mpVersion != this.store.mpVersion) {
      await this.wxLogin();
      wx.setStorageSync("mpVersion", this.store.mpVersion);
    }
    this.initStore();
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
      wx.reLaunch({
        url: "/pages/upwxpage/upwxpage",
      });
    } else if (!this.store.$state.userInfo.mobile) {
      wx.reLaunch({
        url: "/pages/sign/sign",
      });
    } else if(opstObj.p){
      wx.reLaunch({
        url: `/page/vote/pages/voteArticle/voteArticle?voteid=${opstObj.o}&uid=${opstObj.u}`,
      });
    }
  },
  onShow: function (opts) {
    let optsStr = decodeURIComponent(opts.query.scene).split("&");
    let opstObj = {};
    optsStr.forEach((item, index) => {
      opstObj[item.split("=")[0]] = item.split("=")[1];
    });
    let lists = ["share", "invite"];
    /* 小程序(在后台运行中时)从分享卡片切到前台 */
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
      livePlayer
        .getShareParams()
        .then((res) => {
          // 开发者在跳转进入直播间页面时，页面路径上携带的自定义参数，这里传回给开发者
          console.log("get custom params", res.custom_params);
          res.custom_params
            ? [
                wx.setStorageSync("invite", res.custom_params.uid),
                (this.globalData.shareObj = res.custom_params),
              ]
            : "";
        })
        .catch((err) => {
          console.log("get share params", err);
        });
      if (!this.store.$state.userInfo.mobile) {
        wx.reLaunch({
          url: "/pages/sign/sign",
        });
      } else if (opts.type == "lottery") {
        wx.reLaunch({
          url: "/pages/education/education?type=lottery&login=1",
        });
      }
    }
    if (this.store.$state.userInfo.id) {
      setTimeout(() => {
        socket.init(this.store.$state.userInfo.id);
        socket.listen(this.prizemessage, "Prizemessage");
        socket.listen(this.bokemessage, "Bokemessage");
      }, 2000);
    }
  },
  onHide() {
    this.globalData.backstage = true;
    if (this.store.$state.userInfo.id) {
      socket.close();
    }
  },
  onError: function (err) {
    fundebug.notifyError(err);
  },
  wxLogin: async function () {
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
        if (msg.data.tempCode) {
          /* 新用户未注册 */
          console.log("tempCode", msg.data.tempCode);
          this.globalData.tempCode = msg.data.tempCode;
          wx.reLaunch({
            url: "/pages/sign/sign",
          });
        } else {
          /* 旧用户 */
          wx.setStorageSync("token", msg.data.token);
          wx.setStorageSync("uid", msg.data.uid);
          wx.setStorageSync("authKey", msg.data.authKey);
          this.setUser(msg.data.userInfo);
          if (
            this.globalData.query.type == "share" ||
            this.globalData.shareObj.type == "lottery"
          ) {
            let params = [];
            for (let attr in this.globalData.query) {
              params.push(attr + "=" + this.globalData.query[attr]);
            }
            this.globalData.shareObj.type == "lottery"
              ? wx.reLaunch({
                  url:
                    "/pages/education/education?type=lottery&login=1&id=" +
                    this.globalData.lotteryId,
                })
              : wx.reLaunch({
                  url: this.globalData.path + "?" + params.join("&"),
                });
          } else {
            wx.reLaunch({
              url: "/pages/index/index",
            });
          }
        }
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
  },
  /* 更新store中的userInfo */
  setUser: function (data) {
    let areaArray = data.university.split(",");
    if ((!data.address || !data.school) && areaArray.length == 3) {
      data.address = areaArray.slice(0, 2);
      data.addressCity = areaArray[1];
      data.school = areaArray[2];
    }
    this.store.setState({
      userInfo: data,
    });
    wx.setStorageSync("userInfo", data);
    if (data.id) {
      socket.close();
      socket.init(data.id);
      socket.listen(this.prizemessage, "Prizemessage");
      socket.listen(this.bokemessage, "Bokemessage");
    }
  },
  /* 更新AuthKey */
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
    let self = this;
    wx.getSetting({
      success: (res) => {
        if (res.errMsg == "getSetting:ok") {
          let auth = res.authSetting["scope.userInfo"];
          self.store.setState({
            authUserInfo: auth || false,
            baseInfo: !auth && self.store.$state.visitedNum.length > 10,
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
    if (e.detail.errMsg != "getUserInfo:ok") {
      return;
    }
    this.getSets();
    let param = {
      userInfo: JSON.stringify(e.detail.userInfo),
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
    };
    this.user.profile(param).then((msg) => {
      this.setUser(msg.data.userInfo);
    });
  },

  playVedio(type) {
    type == "wifi"
      ? ""
      : this.store.setState({
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
  // 获取用户openid
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
              content: "新版本已经准备好，是否重启应用？",
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
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
  bokemessage(res) {
    let { num = 0, avatar } = JSON.parse(res.data).data;
    this.store.setState({
      unRead: num,
      surPass: num > 99,
      lastMan: avatar,
    });
  },
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
  // 获取新手指引
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
  // 获取任务状态
  getTaskStatus() {
    this.user.getNewTaskStatus().then((res) => {
      this.store.setState({
        taskStatus: res.data,
      });
    });
    this.user.getDayTaskStatus().then((res) => {
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
      path:
        "/pages/index/index?uid=" +
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
  globalData: {
    /*wx.login 返回值 code */
    code: null,
    /* 新用户临时code */
    tempCode: null,
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
    categoryId: 0
  },
});
