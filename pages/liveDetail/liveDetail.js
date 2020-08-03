// pages/liveDetail/liveDetail.js
const LiveDate = require("../../data/LiveDate");

Page({
  data: {
    current: {}, //当前直播信息
    lessonDetail: {}, //课程详情信息
    currentList: [
      {
        url:
          "https://hwvod.jinlingkeji.cn/asset/164ab8e0227a7f379685cbf263c9c4e9/308590ef347a60b264f48c5caae951f3.mp4",
      },
    ], //回放课程列表
    playFlag: false, //播放状态
  },
  onLoad: function (options) {

    this.videoContext = wx.createVideoContext("myVideo");
    this.getLessonDetail(options.lessonId);
  },
  onShow: function () {},
  onUnload: function () {},
  getLessonDetail(lesson_id) {
    let _this = this;
    LiveDate.getLessonDetail({ lesson_id }).then((res) => {
      console.log(res);
      _this.setData({
        current: res.data.current,
        lessonDetail: res.data.lesson,
      });
    });
  },

  //视频播放功能块
  recordAddVedio() {
    this.videoContext.play();
    this.setData({
      playFlag: true,
    });
  },
  played() {  //开始播放
    console.log("开始播放");
  },
  timeupdate() { //进度条变化
    console.log("进度条变化");
  },
  videoPause() {  //暂停播放
    console.log("暂停播放");
  },
  ended() { //播放结束
    console.log("播放结束");
  },
  onPullDownRefresh: function () {},
  onShareAppMessage: function () {},
});
