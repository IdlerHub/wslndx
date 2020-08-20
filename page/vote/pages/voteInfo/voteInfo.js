// page/vote/pages/voteInfo/voteInfo.js
const app = getApp();
Page({
  data: {
    taskList: [],
    voteList: [],
    page: 1,
    total_page: 1,
  },
  onLoad: function (options) {
    this.getTaskList();
    this.getMySendList();
  },
  shareUser(){
    wx.showModal({
      title: '首次进入提示去邀请并且关注公众号才算'
    })
  },
  getTaskList() {
    app.vote
      .getTaskList()
      .then((res) => {
        console.log(res);
        this.setData({
          taskList: res.data,
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
  performTask(){
    console.log("去完成任务或者领取鲜花")
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
  onShareAppMessage: function () {},
});
