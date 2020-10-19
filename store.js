/*
 * @Date: 2019-06-11 14:24:48
 * @LastEditors: wjl
 * @LastEditTime: 2020-08-11 18:00:20
 */
import Store from "wxministore";
let env = "develop";
let imgHost;
let activityUrl;
let API_URL;
let socket_host;
let mpVersion = "v23"; /* 版本管理 */
if (env == "develop") {
  /* 测试环境 */
  imgHost =
    "https://hwcdn.jinlingkeji.cn/images/dev"; /* 图片等静态资源服务器 */
  activityUrl = "https://gqjydev.jinlingkeji.cn/?"; /* 国情教育链接 */
  API_URL = `https://lndxdev.jinlingkeji.cn/api/${mpVersion}/`; /* 数据服务器 */
  socket_host = "develop.jinlingkeji.cn:8182";
} else if (env == "production") {
  /* 发布环境 */
  imgHost = "https://hwcdn.jinlingkeji.cn/images/pro";
  activityUrl = "https://gqjy.jinlingkeji.cn/?";
  API_URL = `https://apielb.jinlingkeji.cn/api/${mpVersion}/`;
  socket_host = "api.jinlingkeji.cn:8182";
} else {
  imgHost = "https://hwcdn.jinlingkeji.cn/images/pro";
  activityUrl = "https://gqjy.jinlingkeji.cn/?";
  API_URL = `https://lndxpre.jinlingkeji.cn/api/${mpVersion}/`;
  socket_host = "api.jinlingkeji.cn:8182";
}

Store.prototype.process = env;
Store.prototype.API_URL = API_URL;
Store.prototype.mpVersion = mpVersion;
Store.prototype.socket_host = socket_host;

let store = new Store({
  state: {
    userInfo: {} /* 用户信息 */ ,
    authUserInfo: false /* （微信用户信息）授权状态 */ ,
    authRecord: false /* （微信用户录音）授权状态 */ ,
    authRecordfail: false /* （微信用户录音）授权拒绝状态 */ ,
    visitedNum: [] /* 最多10个未授权视频 */ ,
    baseInfo: false /* 提示已超过10个视频，要求授权 */ ,
    authKey: "" /* 小程序进入h5的身份标识 */ ,
    activityUrl: activityUrl,
    signStatus: {} /* 签到状态及弹窗 */ ,
    imgHost: imgHost,
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
    userIndex: {}
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
      this.pageRecord ?
        [this.getPlayerState(), wx.setKeepScreenOn({
          keepScreenOn: true
        })] :
        [getApp().backgroundAudioManager.stop(), wx.setKeepScreenOn({
          keepScreenOn: false
        })];
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
        title: this.data.$state.shareTitle || "福利！老年大学十万集免费课程在线学习",
        path: "/pages/index/index?uid=" +
          this.data.$state.userInfo.id +
          "&type=invite",
        imageUrl: this.data.$state.shareImgurl || "../../images/sharemessage.jpg",
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