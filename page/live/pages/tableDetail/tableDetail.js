// pages/tableDetail/tableDetail.js
const LiveData = require("../../../../data/LiveData");
Page({
  data: {
    days: 0,
    hours: "00",
    minutes: "00",
    seconds: "00",
    lessonId: null,
    avatarList: [], //邀请用户头像
    showMoreAvatar: false, //是否展示更多头像
    weekList: [
      "每周一",
      "每周二",
      "每周三",
      "每周四",
      "每周五",
      "每周六",
      "每周日",
    ],
    lessonDetail: {}, //课程详情
  },
  timer: "",
  onLoad: function (options) {
    console.log(options);
    let inviter = 0;
    if (options.inviter && this.data.$state.userInfo.id != options.inviter) {
      console.log("分享进来的", this.data.$state);
      inviter = options.inviter;
    }
    this.data.lessonId = options.lessonId;
    this.getLiveDetailDate(options.lessonId, inviter);
    this.timer = setInterval(() => {
      let countdown = this.data.lessonDetail.countdown - 1;
      this.leftTimer(countdown);
    }, 1000);
  },
  onUnload() {
    clearInterval(this.timer);
  },
  getLiveDetailDate(lesson_id, inviter = 0) {
    //获取邀请记录,报名详情
    let _this = this;
    let params = {
      lesson_id,
      inviter, //如果是邀请进来的,就在获取的时候提交记录
    };
    return Promise.all([
      LiveData.getApplyDetail(params),
      LiveData.getInviteRecord({ lesson_id }),
    ])
      .then((res) => {
        wx.setNavigationBarTitle({
          title: res[0].data.name || "",
        });
        _this.setData({
          lessonDetail: res[0].data,
          avatarList: res[1].data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  leftTimer(leftTime) {
    this.data.lessonDetail.countdown = leftTime;
    // leftTime = leftTime - Date.parse(new Date()) / 1000; //计算剩余的毫秒数
    var days = parseInt(leftTime / 3600 / 24, 10); //计算剩余的天数
    var hours = parseInt((leftTime / 3600) % 24, 10); //计算剩余的小时
    var minutes = parseInt((leftTime / 60) % 60, 10); //计算剩余的分钟
    var seconds = parseInt(leftTime % 60, 10); //计算剩余的秒数
    days = days > 0 ? days : 0;
    hours = this.checkTime(hours);
    minutes = this.checkTime(minutes);
    seconds = this.checkTime(seconds);
    let flag =
      days == "0" && seconds == "00" && hours == "00" && minutes == "00";
    if (flag) clearInterval(this.timer);
    this.setData({
      days,
      hours,
      minutes,
      seconds,
    });
  },
  checkTime(i) {
    if (i < 0) {
      i = 0;
    }
    return i < 10 ? "0" + i : i;
  },
  rightNow() {
    let { conditions, invite_num, is_own } = this.data.lessonDetail;
    if (conditions != invite_num) {
      wx.showModal({
        content: `再邀请${conditions - invite_num}位好友就可以学习啦`,
        confirmColor: "#DF2020",
        cancelColor: "#999999",
      });
    } else {
      let lesson_id = this.data.lessonDetail.id;
      if (!is_own) {  //未拥有
        LiveData.getReceiveLesson({ lesson_id })
          .then((res) => {
            this.data.lessonDetail.is_own = 1;
            wx.navigateTo({
              url: `/page/live/pages/liveDetail/liveDetail?lessonId=${lesson_id}&isFirst=1`,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {  //已拥有就不再领取,从分享进去详情页,不展示客服盒子
        wx.navigateTo({
          url: `/page/live/pages/liveDetail/liveDetail?lessonId=${lesson_id}&isFirst=0`,
        });
      }
    }
  },
  showAllAvatar() {
    if (this.data.lessonDetail.conditions > 5) {
      //展示所有头像
      this.setData({
        showMoreAvatar: !this.data.showMoreAvatar,
      });
    }
  },
  onShareAppMessage: function () {
    let lesson_id = this.data.lessonDetail.id,
      cover = this.data.lessonDetail.cover;
    let { id, nickname } = this.data.$state.userInfo;
    return {
      title: `${nickname}邀请你`,
      path: `/page/live/pages/tableDetail/tableDetail?lessonId=${lesson_id}&inviter=${id}`,
      imageUrl: cover,
    };
  },
});
