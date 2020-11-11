// pages/tableDetail/tableDetail.js
const LiveData = require("../../../../data/LiveData");
const user = require("../../../../data/User");
var htmlparser = require("../../../../utils/htmlparser");

Page({
  data: {
    days: 0,
    hours: "00",
    minutes: "00",
    seconds: "00",
    lessonId: null,
    avatarList: [], //邀请用户头像
    showMoreAvatar: false, //是否展示更多头像
    userMsg: {},
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
    flag: false, //倒计时结束
    showAtention: false,
    showAll: 0
  },
  timer: "",
  toEducation: false,
  onShow() {
    if(this.toEducation) {
      this.getUserOpenid(1)
      this.toEducation = false
    }
  },
  onLoad: function (options) {
    console.log(options)
    let inviter = 0;
    if (options.inviter && this.data.$state.userInfo.id != options.inviter) {
      inviter = options.inviter;
    }
    this.data.lessonId = options.specialColumnId;
    // this.getLiveDetailDate(options.lessonId, inviter);
    this.getLiveBySpecialColumnId(options.specialColumnId)
    this.getUserOpenid()
    // this.timer = setInterval(() => {
    //   let countdown = this.data.lessonDetail.countdown - 1;
    //   this.leftTimer(countdown);
    // }, 1000);
  },
  onUnload() {
    // clearInterval(this.timer);
  },
  getUserOpenid(type) {
    user.myIndex().then(res => {
      this.setData({
        userMsg: res.data
      }, () => {
        type ? this.toLivedetail() : ''
      })
    })
  },
  getLiveDetailDate(lesson_id, inviter = 0) {
    //获取邀请记录,报名详情
    let _this = this;
    let params = {
      lesson_id,
      inviter, //如果是邀请进来的,就在获取的时候提交记录
    };
    let flag = false;
    return Promise.all([
        LiveData.getApplyDetail(params),
        LiveData.getInviteRecord({
          lesson_id
        }),
      ])
      .then((res) => {
        wx.setNavigationBarTitle({
          title: res[0].data.name || "",
        });
        if (res[0].data.is_own == 1) {
          wx.redirectTo({
            url: `/page/live/pages/liveDetail/liveDetail?lessonId=${lesson_id}&isFirst=0`,
          });
          return;
        }
        if (res[0].data.invite_msg != "") {
          wx.showToast({
            title: res[0].data.msg,
            title: res[0].data.invite_msg,
            icon: "none",
            duration: 3000,
          });
        }
        if (res[0].data.countdown <= 0) flag = true;
        res[0].data.introduction = htmlparser.default(res[0].data.introduction);
        _this.setData({
          lessonDetail: res[0].data,
          avatarList: res[1].data,
          flag,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getLiveBySpecialColumnId(id) {
    return LiveData.getLiveBySpecialColumnId({
      specialColumnId: id
    }).then(res => {
      res.data.liveLecturerUserDTOS ? res.data.liveLecturerUserDTOS.forEach(e => {
        res.data['teacher'] ?  res.data.teacher = res.data.teacher + ' ' + e.nickname : res.data.teacher = e.nickname
      }) : ''
      res.data.isAddSubscribe ? wx.redirectTo({
        url: `/page/live/pages/liveDetail/liveDetail?lessonId=${res.data.columnId}`
      }) : 
      res.data.introduction = htmlparser.default(res.data.introduction);
      this.setData({
        lessonDetail: res.data,
        showAll: 1
      })
    })
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
    if (flag) {
      this.setData({
        flag,
      });
      clearInterval(this.timer);
    }
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
    // let {
    //   conditions,
    //   invite_num,
    //   is_own
    // } = this.data.lessonDetail;
    // if (conditions > invite_num) {
    //   wx.showModal({
    //     content: `再邀请${conditions - invite_num}位好友就可以学习啦`,
    //     confirmColor: "#DF2020",
    //     cancelColor: "#999999",
    //   });
    // } else 
    if(!this.data.userMsg.has_mp_openid){
      this.setData({
        showAtention: true
      })
    } else {
      this.toLivedetail()
    }
  },
  showAllAvatar() {
    let {
      conditions,
      invite_num
    } = this.data.lessonDetail;
    if (conditions > 5 || invite_num > 5) {
      //展示所有头像
      this.setData({
        showMoreAvatar: !this.data.showMoreAvatar,
      });
    }
  },
  shareLesson(lesson_id) {
    //分享成功
    LiveData.shareLesson({
      lesson_id
    });
  },
  onPullDownRefresh() {
    this.getLiveDetailDate(this.data.lessonId).then((res) => {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: "刷新完成",
        duration: 1000,
      });
    });
  },
  onShareAppMessage: function () {
    let lesson_id = this.data.lessonDetail.id,
      cover = this.data.lessonDetail.cover;
    let id = this.data.$state.userInfo.id;
    this.shareLesson(lesson_id);
    return {
      title: `快来和我一起报名,免费好课天天学!`,
      path: `/page/live/pages/tableDetail/tableDetail?lessonId=${lesson_id}&inviter=${id}&liveShare=1`,
      imageUrl: cover,
    };
  },
  toLivedetail() {
    let columnId = this.data.lessonDetail.columnId;
    let {
      isAddSubscribe
    } = this.data.lessonDetail;
    if (!isAddSubscribe) {
      //未拥有
      LiveData.addSubscribe({
        columnId,
        mpOpenid: this.data.userMsg.prentice_count
        })
        .then((res) => {
          this.data.lessonDetail.isAddSubscribe = 1;
          wx.redirectTo({
            url: `/page/live/pages/liveDetail/liveDetail?specialColumnId=${columnId}&isFirst=1`,
          });
        })
        .catch((err) => {
          wx.showToast({
            title: err.msg,
            image: "/images/warn.png",
            duration: 1000,
          });
        });
    } else {
      //已拥有就不再领取,从分享进去详情页,不展示客服盒子
      wx.navigateTo({
        url: `/page/live/pages/liveDetail/liveDetail?lessonId=${columnId}&isFirst=0`,
      });
    }
  },
  toAtention() {
    let uid = wx.getStorageSync("userInfo").id;
    // wx.setStorageSync("AccountsId", ops.accounts_openid);
    //liveTyp标识从哪里跳转
    wx.navigateTo({
      url: `/pages/education/education?liveType=liveTable&uid=${uid}`,
    });
    this.toEducation = true
  }
});