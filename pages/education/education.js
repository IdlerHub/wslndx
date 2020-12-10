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
  activityShare: 0,
  onLoad: function (options) {
    this.options = options
    console.log(options)
    setTimeout(() => {
      if (options.classId) {
        // let webURL = "http://192.168.1.68:8080/#/order-detail";
        let webURL = "https://globalh5pro.jinlingkeji.cn/enrollment_small/#/order-detail";
        let id = options.classId;
        this.setData({
          url: webURL + "?id=" + id,
        });
      } else if (options.liveType) {
        //直播课表获取用户公众号openid
        let webURL = `https://authorization.jinlingkeji.cn/#/?uid=${options.uid}`;
        if (options.liveType == "wechatarticle") {
          // console.log("重定向跳转推文链接");
          // 获取之后前往推文链接
          webURL = "https://mp.weixin.qq.com/s/bdGLXj6u6aOGVNh2owTjgA"; //跳转推文的链接
        }
        this.setData({
          url: webURL,
        });
      } else if (options.voteType) {
        //获取公众号openid
        let webURL = `https://authorization.jinlingkeji.cn/#/?voteType=voteIndex&uid=${options.uid}`;
        if (options.voteType == "voteArticle") {
          // 从详情页跳转过来获取公众号的openId
          webURL = `https://authorization.jinlingkeji.cn/#/?voteType=voteArticle&voteid=${options.voteid}&uid=${options.uid}`;
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
        if (options.type == 'task') { //票选活动页面任务
          const event = this.getOpenerEventChannel();
          event.on(options.type, (data) => {
            this.junmpOut(data.url);
          });
        } else if (options.type == "live") { //直播课
          const event = this.getOpenerEventChannel();
          event.on("liveCode", (data) => {
            console.log(data);
            this.junmpOut(data.url);
          });
        } else if (options.type === "farm") {
          this.junmpOut("https://h5xyx.jinlingkeji.cn");
          wx.uma.trackEvent("index_btnClick", {
            btnName: "开心农场"
          });
        } else if (options.type === "sign") {
          let webURL = `https://authorization.jinlingkeji.cn/#/?uid=${this.data.$state.userInfo.id}&type=sign`;
          this.setData({
            url: webURL
          })
        } else if(options.type === "recruit") {
          this.setData({
            url: 'https://' + options.url
          })
        }else {
          if (options.login) {
            if (options.login == 0) {
              this.junmpOut(options.url);
            } else {
              this.webJump(options.url);
            }
          } else {
            this.junmpOut(options.url);
          }
        }
      }
    }, 1000);
  },
  junmpOut(url) {
    this.setData({
      // url: this.data.$state.activityUrl + "mobile=" + encodeURIComponent(this.data.$state.userInfo.mobile) + "&authKey=" + encodeURIComponent(this.data.$state.authKey)
      url,
    });
  },
  webJump(webURL) { //H5跳转
    let token = wx.getStorageSync("token");
    this.setData({
      url: webURL +
        "?openId=" +
        this.data.$state.openId +
        "&token=" + token +
        "&terminal=miniprogram",
      pay: true
    });
  },
  setPostData(e) {
    console.log(e)
  },
  onShareAppMessage(ops) {
    let shareUrl = ops.webViewUrl.split('#')[0]
    if(shareUrl.indexOf('enrollment_small') != -1) {
      return {
        title: '我已入学【网上老年大学】,你也快来一起学习吧',
        path: `/pages/education/education?type=0&url=${shareUrl+ '/#/login'}&login=1`,
        imageUrl: "https://hwcdn.jinlingkeji.cn/app/zsxtshare.jpg"
      }
    } else {
      return this.menuAppShare();
    }
  }
});