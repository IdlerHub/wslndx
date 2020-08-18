//Page Object
import md5 from "../../utils/md5.js";
const app = getApp();
Page({
  data: {
    url: "",
    payStatus: "",
    classId: '', //招生的课程ID
    pay: false
  },
  pageName: "外链页（开心农场&amp;老年电台&amp;早报）",
  onLoad: function (options) {
    if (options.classId) {
      // let webURL = "http://192.168.1.68:8080/#/order-detail";
      let webURL = "https://elsmallpro.jinlingkeji.cn/#/order-detail";
      let id = options.classId;
      this.setData({
        url: webURL + "?id=" + id
      });
    }else if(options.voteType){ //获取公众号openid
      let webURL = "https://enrollmenth5dev.jinlingkeji.cn/#/";
      if (options.voteType == "voteDetail") {
        // 从详情页跳转过来获取公众号的openId
        webURL = "https://enrollmenth5dev.jinlingkeji.cn/#/?type=voteDetail";
      }
      this.setData({
        url: webURL,
      });
    }

    if (!options.type) {
      let optsStr = decodeURIComponent(options.scene).split("&"),
        opstObj = {};
      optsStr.forEach((item, index) => {
        opstObj[item.split("=")[0]] = item.split("=")[1];
      });
    } else {
      if(options.type == "live"){
        const event = this.getOpenerEventChannel();
        event.on("liveCode", (data) => {
          console.log(data);
          this.junmpOut(data.url);
        });
      }else if (options.type === "farm") {
        this.junmpOut("https://h5xyx.jinlingkeji.cn");
        wx.uma.trackEvent("index_btnClick", {
          btnName: "开心农场"
        });
      } else if (options.type === "station") {
        this.junmpOut(
          "https://open.ximalaya.com/site/index/174/ca5492cf55806b41713dada77a1d2ed5"
        );
        wx.uma.trackEvent("index_btnClick", {
          btnName: "老年电台"
        });
      } else if (options.type === "doudizhu") {
        let openID = "";
        wx.getStorage({
          key: "openId",
          success: (res) => {
            this.junmpOut(`https://lnddz.293k.com/?openid=${res.data}`);
          },
        });
      } else if (options.type === "lottery") {
        this.webJump();
      } else {
        if (options.login) {
          if (options.login == 0) {
            this.junmpOut(options.url);
          } else {
            this.webJump();
          }
        } else {
          this.junmpOut(options.url);
        }
      }
    }
  },
  junmpOut(url) {
    this.setData({
      // url: this.data.$state.activityUrl + "mobile=" + encodeURIComponent(this.data.$state.userInfo.mobile) + "&authKey=" + encodeURIComponent(this.data.$state.authKey)
      url,
    });
  },
  webJump() { //H5跳转

    // https://elsmalldev.jinlingkeji.cn   开发
    // https://elsmalltest.jinlingkeji.cn   测试
    // https://elsmallpro.jinlingkeji.cn   生产

    // let webURL = "http://192.168.1.68:8080/#/login";
    let webURL = "https://elsmallpro.jinlingkeji.cn/#/login";
    let uid = this.data.$state.userInfo.id;
    let token = wx.getStorageSync("token");
    let timestamp = parseInt(new Date().getTime() / 1000 + "");
    let sign = md5(
      "uid=" + uid + "&token=" + token + "&timestamp=" + timestamp
    );
    this.setData({
      url: webURL +
        "?openId=" +
        this.data.$state.openId +
        "&uid=" +
        this.data.$state.userInfo.id +
        "&sign=" +
        sign +
        "&timestamp=" +
        timestamp,
      pay: true
    });
  },
  onShareAppMessage(ops) {
    if (this.data.pay) {
      return {
        title: '我已入学【网上老年大学】,你也快来一起学习吧',
        path: "/pages/education/education?type=0&login=1",
        imageUrl: "https://hwcdn.jinlingkeji.cn/app/zsxtshare.jpg"
      }
    } else {
        return this.menuAppShare();
    }
  }
});