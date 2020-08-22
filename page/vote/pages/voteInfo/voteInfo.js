// page/vote/pages/voteInfo/voteInfo.js
const app = getApp();
Page({
  data: {
    flowers: 0, //拥有花朵
    shareMessage: {}, //分享配置信息
    taskList: [],
    voteList: [],
    page: 1,
    total_page: 1,
  },
  onLoad: function (options) {
    this.getTaskList();
    this.getMySendList();
  },
  shareUser() {
    wx.showModal({
      title: "首次进入提示去邀请并且关注公众号才算",
    });
  },
  getTaskList() {
    app.vote
      .getTaskList()
      .then((res) => {
        console.log(res);
        this.setData({
          taskList: res.data.task,
          shareMessage: res.data.share_message,
          flowers: res.data.flowers,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getMySendList(page = 1) {
    let voteList = this.data.voteList;
    app.vote
      .getMySendList({ page })
      .then((res) => {
        let total_page = res.data.total_page;
        if (page == 1) {
          voteList = res.data.list;
        } else {
          voteList = voteList.concat(res.data.list);
        }
        this.setData({
          voteList,
          page,
          total_page,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  performTask(e) {
    let task = e.currentTarget.dataset.task;
    console.log("去完成任务或者领取鲜花", task);
    if (task.prize_status == 1) {
      //任务完成,领取奖励
      this.getTaskPrize(task.id);
    }
    //去执行任务
    if (task.urltype == 1) {
      //执行邀请的方法列表,不需要处理
      return;
    } else if (task.urltype == 2) {
      //交互任务,类似签到
      //执行接口请求的方法列表
      this.toGetHttp(task.url);
    } else if (task.urltype == 3) {
      //跳转任务页面
      //执行外链接的方法列表
      this.doTask(task.id);
      this.jumpTask(task);
    }
  },
  doTask(task_id) {
    app.vote.doTask({ task_id });
  },
  //跳转任务
  jumpTask(task) {
    //微信推文页面
    wx.navigateTo({
      url: "/pages/education/education?type=task",
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit("task", { url: task.url });
        //发起请求,完成任务
      },
    });
  },
  //接口请求
  toGetHttp(url, params = {}) {
    app.vote.toGetHttp(url, params).then((res) => {
      console.log(res);
    });
  },
  // 领取任务奖励
  getTaskPrize(task_id) {
    app.vote.getTaskPrize({ task_id }).then((res) => {
      console.log(res);
      wx.showToast({
        title: res.msg,
        icon: "none",
        duration: 1500,
      });
    });
  },
  toDetail(e) {
    wx.navigateTo({
      url:
        "/page/vote/pages/voteArticle/voteArticle?voteid=" +
        e.currentTarget.dataset.id,
    });
  },
  onShow: function () {},
  onPullDownRefresh: function () {
    console.log("刷新");
    this.setData({
      taskList: [],
      voteList: [],
      page: 1,
      total_page: 1,
    });
    Promise.all([this.getTaskList(), this.getMySendList()]).then((res) => {
      wx.showToast({
        title: "刷新完成",
        duration: 1000,
      });
      wx.stopPullDownRefresh();
    });
  },
  onReachBottom: function () {
    console.log("分页加载");
    if (this.data.total_page > this.data.page) {
      this.getMySendList(this.data.page + 1);
    } else {
      wx.showToast({
        icon: "none",
        title: "已经到底了哦",
        duration: 1000,
      });
    }
  },
  onShareAppMessage() {
    console.log("分享");
    let uid = wx.getStorageSync("userInfo").id;
    return {
      title: this.data.shareMessage.title,
      path: "/page/vote/pages/voteIndex/voteIndex?type=share&vote=1&uid=" + uid, // 路径，传递参数到指定页面。
      imageUrl: this.data.shareMessage.image,
    };
  },
});
