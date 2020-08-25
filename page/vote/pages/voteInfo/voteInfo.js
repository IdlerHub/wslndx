// page/vote/pages/voteInfo/voteInfo.js
const app = getApp();
Page({
  data: {
    flowers: 0, //拥有花朵
    isShow: 0,  //是否首次点击分享
    isShowMessage: "好友通过邀请链接或二维码进入活动，并且关注公众号才算邀请成功得鲜花哦~",  //首次分享提示内容
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
  showToast(title) {
    wx.showToast({
      title,
      icon: "none",
      duration: 1500,
    });
  },
  toRefresh() {
    app.vote
      .getTaskList()
      .then((res) => {
        this.showToast("鲜花数已更新,做任务获得更多鲜花");
        this.setData({
          flowers: res.data.flowers,
        });
      })
      .catch((err) => {
        this.showToast(err.msg);
      });
  },
  getTaskList() {
    app.vote
      .getTaskList()
      .then((res) => {
        this.setData({
          // isShow: res.data.is_show,
          isShowMessage: res.data.is_show_message,
          taskList: res.data.task,
          shareMessage: res.data.share_message,
          flowers: res.data.flowers,
        });
      })
      .catch((err) => {
        this.showToast(err.msg);
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
        this.showToast(err.msg);
      });
  },
  changeIsShow(){
    let _this = this;
    if (_this.data.isShow == 0) {
        wx.showModal({
          title: _this.data.isShowMessage,
          confirmColor: "#F2323A",
          success(res) {
            _this.setData({
              isShow: 1,
            });
            app.vote.changeIsShow();
          },
        });
      }
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
      //执行邀请的方法列表,首次进来需要弹窗
    this.changeIsShow();
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
      this.showToast(res.msg);
      this.getTaskList();
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
      this.showToast("已经到底了哦");
    }
  },
  onShareAppMessage() {
    let uid = wx.getStorageSync("userInfo").id;
    console.log("分享", this.data.shareMessage.title);
    let title = this.data.shareMessage.title;
    let imageUrl = this.data.shareMessage.image;
    return {
      title,
      path: "/page/vote/pages/voteIndex/voteIndex?type=share&vote=1&uid=" + uid, // 路径，传递参数到指定页面。
      imageUrl,
    };
  },
});
