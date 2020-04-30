/*
 * @Date: 2020-03-04 12:20:44
 * @LastEditors: hxz
 * @LastEditTime: 2020-03-06 13:41:15
 */
// pages/voteClassify/voteClassify.js
const app = getApp();
Page({
  data: {
    classifyList: [{ id: "0", name: "全部" }],
    selectedIndex: 0
  },
  toVote(e) {
    let list = getCurrentPages();
    const page = list[list.length - 2];
    page.changeData(
      e.currentTarget.dataset.index,
      e.currentTarget.dataset.type
    );
    wx.navigateBack();
    // wx.redirectTo({
    //   url: `/pages/vote/vote?index=${e.currentTarget.dataset.index}&type=${e.currentTarget.dataset.type} `
    // })
  },
  join() {
    wx.navigateTo({
      url: "/pages/voteProduction/voteProduction"
    });
  },
  works() {
    wx.navigateTo({
      url: "/pages/myProduction/myProduction"
    });
  },
  getCategory() {
    let data = [{ id: "0", name: "全部" }];
    app.vote.getCategory().then(res => {
      data = data.concat(res.data.data);
      this.setData({
        classifyList: data
      });
    });
  },
  onLoad() {
    let pages = getCurrentPages();
    this.beforePage = pages[0];
    this.getCategory();
  }
});
