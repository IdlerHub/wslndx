/*
 * @Date: 2019-06-11 14:24:48
 * @LastEditors: wjl
 * @LastEditTime: 2020-08-11 18:00:20
 */
import Store from "wxministore";
let env = "dev";
let mpVersion = "v24"; /* 版本管理 */
/* 图片等静态资源服务器 */
let imgBase = {
  dev: "https://hwcdn.jinlingkeji.cn/images/dev",
  test: "https://hwcdn.jinlingkeji.cn/images/dev",
  pro: "https://hwcdn.jinlingkeji.cn/images/pro",
  testpro: "https://hwcdn.jinlingkeji.cn/images/pro",
};
/* 国情教育链接 */
let activityBase = {
  dev: "https://gqjydev.jinlingkeji.cn/?",
  test: "https://gqjydev.jinlingkeji.cn/?",
  pro: "https://gqjy.jinlingkeji.cn/?",
  testpro: "https://gqjy.jinlingkeji.cn/?",
};
/* 数据服务器 */
let API_URLBASE = {
  dev: `https://lndxdev.jinlingkeji.cn/api/${mpVersion}/`,
  test: `https://lndxtest.jinlingkeji.cn/api/${mpVersion}/`,
  pro: `https://apielb.jinlingkeji.cn/api/${mpVersion}/`,
  testpro: `https://lndxpre.jinlingkeji.cn/api/${mpVersion}/`,
};
/* webSocket服务 */
let socetBase = {
  dev: "lndxdev.jinlingkeji.cn:8182",
  test: "lndxtest.jinlingkeji.cn:8182",
  pro: "api.jinlingkeji.cn:8182",
  testpro: "lndxpre.jinlingkeji.cn:8182"
}
/* IMSDKAPPID */
let sdkAppid = {
  dev: "1400346137",
  test: "1400390948",
  pro: "1400358896",
  testpro: "1400358896"
}
/* 过渡接口域名 */
let API_URLBASECHECK = {
  dev: `https://smallgwdev.jinlingkeji.cn/mini/`,
  test: `https://smallgwtest.jinlingkeji.cn/mini/`,
  pro: `https://smallgwpro.jinlingkeji.cn/mini/`,
  testpro: `https://smallgwpro.jinlingkeji.cn/mini/`,
}

Store.prototype.process = env;
Store.prototype.API_URL = API_URLBASE[env];
Store.prototype.API_URLBASECHECK = API_URLBASECHECK[env];
Store.prototype.mpVersion = mpVersion;
Store.prototype.socket_host = socetBase[env];


let store = new Store({
  state: {
    userInfo: {} /* 用户信息 */,
    authUserInfo: false /* （微信用户信息）授权状态 */,
    authRecord: false /* （微信用户录音）授权状态 */,
    authRecordfail: false /* （微信用户录音）授权拒绝状态 */,
    visitedNum: [] /* 最多10个未授权视频 */,
    baseInfo: false /* 提示已超过10个视频，要求授权 */,
    authKey: "" /* 小程序进入h5的身份标识 */,
    activityUrl: activityBase[env],
    signStatus: {} /* 签到状态及弹窗 */,
    imgHost: imgBase[env],
    sdkAppid: sdkAppid[env],
    title: "",
    path: "",
    imageUrl: "",
    shareImgurl: "",
    shareTitle: "",
    recommend: "",
    playVedio: false,
    lessDiscussion: {},
    blogcomment: {},
    security: {},
    newGuide: {
      index: 1,
      blog: 1,
      lesson: 1,
      shortvideo: 1,
      user: 1,
      lesson_category: 1,
    },
    blackShow: false,
    openId: "",
    userIndex: {},
    messageReceived: 0,
    showLogin: false
  },
  pageLisener: {
    onLoad(opts) {
      this.pramas = {
        uid: this.data.$state.userInfo.id,
      };
      if (!this.onShareAppMessage) {
        wx.showShareMenu();
        this.onShareAppMessage = function (ops) {
          if (ops.from === "menu") {
            return this.menuAppShare();
          }
        };
      }
    },
    onShow() {
      wx.uma.trackEvent("join_page", {
        pageName: this.pageName,
      });
      this.pageRecord
        ? [
            this.getPlayerState(),
            wx.setKeepScreenOn({
              keepScreenOn: true,
            }),
          ]
        : [
            getApp().backgroundAudioManager.stop(),
            wx.setKeepScreenOn({
              keepScreenOn: false,
            }),
          ];
    },
    onHide() {
      wx.uma.trackEvent("move", {
        pageName: this.pageName,
      });
    },
    onUnload() {
      this.pageName == "首页" ? clearInterval(this.timer) : "";
    },
  },
  methods: {
    menuAppShare() {
      wx.uma.trackEvent("totalShare", {
        shareName: "tab三个点",
      });
      return {
        title:
          this.data.$state.shareTitle || "福利！老年大学十万集免费课程在线学习",
        path:
          "/pages/index/index?uid=" +
          this.data.$state.userInfo.id +
          "&type=invite",
        imageUrl:
          this.data.$state.shareImgurl || "../../images/sharemessage.jpg",
      };
    },
    getPlayerState() {
      console.log(342423);
      wx.getBackgroundAudioPlayerState({
        success(res) {
          console.log(res);
          if (res.status != 1) {
            getApp().backgroundAudioManager.stop();
          }
        },
      });
    },
  },
});

module.exports = store;
