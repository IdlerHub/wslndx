// pages/tableDetail/tableDetail.js
Page({
  data: {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    avatarList: [
      //邀请用户头像
      {
        id: 11,
        uid: 431,
        avatar:
          "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com/images/default_avatar.png",
      },
      {
        id: 10,
        uid: 430,
        avatar:
          "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com/images/default_avatar.png",
      },
      {
        id: 9,
        uid: 423,
        avatar:
          "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEL2oicEGzxYnlic8BGp3cYwmhVlRc2EWl0R4gvHab5TfVJfhGzyTGpm42hvQwoyLIW5APmACOLTNg0A/132",
      },
      {
        id: 8,
        uid: 401,
        avatar:
          "https://wx.qlogo.cn/mmopen/vi_32/UuaXH4uqFEvBDx1VXCibpk8o0zqhA0MuUBzztbMiaC8sId6cFvapGOfjgQO9eANsB6ibicG4vFpjIsCUPWbLcqJzKQ/132",
      },
      {
        id: 7,
        uid: 388,
        avatar:
          "https://wx.qlogo.cn/mmopen/vi_32/NhBClVGd7lfvZ8jC4vz8g3560sIxlE5qErRokxN38AwcoRiaBiapTKRkQQXzpgngfYPr1ia7QRPVtIZZpfhZKIk5A/132",
      },
    ],
    showMoreAvatar: true, //是否展示更多头像
    showServise: false, //客服消息
    weekList: [
      "每周一",
      "每周二",
      "每周三",
      "每周四",
      "每周五",
      "每周六",
      "每周日",
    ],
    lessonDetail: {
      //课程详情
      id: 1,
      name: "美术课",
      description: "美术课",
      cover:
        "https://hwcdn.jinlingkeji.cn/uploads/images/937caf1a361ac4d2bc33dfb931ed622d.jpg",
      introduction: "<p>美术课美术课美术课美术课美术课术课</p>",
      chapter_num: 1,
      teacher: "王老师",
      start_day: "7月30日",
      end_day: "8月30日",
      start_time: "10:20",
      end_time: "11:20",
      week: 1,
      countdown: 1277934,
      conditions: 10, //总共需邀请人数
      invite_num: 5, //已经邀请人数
      is_own: 0,
    },
  },
  timer: "",
  onLoad: function (options) {
    let countdown = this.data.lessonDetail.countdown;
    this.leftTimer(countdown);
    this.timer = setInterval(() => {
      this.leftTimer(countdown);
    }, 1000);
  },
  onShow: function () {},
  onUnload() {
    clearInterval(this.timer);
  },
  onPullDownRefresh: function () {},
  onShareAppMessage: function () {},
  
  leftTimer(timer) {
    var leftTime = new Date(timer * 1000) - new Date(); //计算剩余的毫秒数
    var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
    var hours = parseInt((leftTime / 1000 / 60 / 60) % 24, 10); //计算剩余的小时
    var minutes = parseInt((leftTime / 1000 / 60) % 60, 10); //计算剩余的分钟
    var seconds = parseInt((leftTime / 1000) % 60, 10); //计算剩余的秒数
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
    let { is_own } = this.data.lessonDetail;
    if (!is_own) {
      wx.showModal({
        content: `再邀请${conditions - invite_num}位好友就可以上课啦`,
        confirmColor: "#DF2020",
        cancelColor: "#999999",
      });
    } else {
      // if(第一次进,展示客服提示)
      this.setData({
        showServise: true,
      });
      // else{}
    }
  },
  showServise() { //展示客服页面
    this.setData({
      showServise: !this.data.showServise,
    });
  },
  showAllAvatar(){  //展示所有头像
    this.setData({
      showMoreAvatar: !this.data.showMoreAvatar
    });
  }
});