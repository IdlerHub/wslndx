/*
 * @Date: 2020-02-29 18:58:44
 * @LastEditors: hxz
 * @LastEditTime: 2020-03-06 11:27:15
 */
// pages/usermesseage/usermesseage.js
const app = getApp();
Page({
  data: {
    newsList: []
  },
  pageName: "我的消息页",
  onLoad: function(options) {},
  onShow: function() {
    this.getMessage();
  },
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  tomessage(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/messagePage/messagePage?id=" + id
    });
  },
  getMessage() {
    app.user.getMessage().then(res => {
      this.setData({
        newsList: res.data
      });
    });
  }
});
