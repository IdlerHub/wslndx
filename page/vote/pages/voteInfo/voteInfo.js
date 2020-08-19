// page/vote/pages/voteInfo/voteInfo.js
Page({
  data: {
    taskList: [{
        "id": 1,
        "name": "签到",
        "numbers": 1,
        "integral": 3,
        "desc": "签到任务",
        "tips_message": ["去签到", "已签到", "已领取"],
        "url": "",
        "urltype": 2,
        "get_integral": 0,
        "prize_status": 2
    }, {
        "id": 2,
        "name": "分享",
        "numbers": 1666,
        "integral": 6,
        "desc": "分享任务",
        "tips_message": ["去完成", "已完成", "已领取"],
        "url": "",
        "urltype": 0,
        "get_integral": 0,
        "prize_status": 2
    }],
    voteList: [
      {
        id: 2,
        name: "汪得章",
        image:
          "https://xiehui-guanwang.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/20190815%5Ca6dbd1bf97aeb528e2aa6964fb2ab468.jpg",
        class_name: "如何装比",
        flowers: 23,
      },
    ],
  },

  onLoad: function (options) {},
  onShow: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
});
