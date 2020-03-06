/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: hxz
 * @LastEditTime: 2020-03-06 11:26:43
 */
//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    isRefreshing: false,
    my_score: 0,
    showGuide: true
  },
  pageName: "个人中心",
  guide: 0,
  onLoad() {},
  onShow() {
    app.user.pointsinfo().then(res => {
      this.setData({
        my_score: res.data.mypoints
      });
    });
    this.unreadNum();
  },
  onPullDownRefresh: function() {
    this.setData({
      isRefreshing: true
    });

    let timer = setTimeout(() => {
      this.setData({
        isRefreshing: false
      });
      wx.stopPullDownRefresh();
      clearTimeout(timer);
    }, 1000);
  },
  handleContact(e) {
    wx.uma.trackEvent("personal_btnClick", { btnName: "联系客服" });
  },
  toScore() {
    wx.navigateTo({
      url: "/pages/score/score?type=index"
    });
    wx.uma.trackEvent("personal_btnClick", { btnName: "学分兑换" });
  },
  toInvite() {
    wx.navigateTo({
      url: "/pages/invitation/invitation"
    });
    wx.uma.trackEvent("personal_btnClick", { btnName: "邀请好友" });
  },
  //用于数据统计
  onUnload() {},
  closeGuide() {
    if (this.guide) return;
    this.guide = true;
    let param = {
      guide_name: "user"
    };
    app.user
      .guideRecordAdd(param)
      .then(res => {
        app.getGuide();
      })
      .catch(() => {
        this.guide = 0;
      });
  },
  drawPage() {
    wx.uma.trackEvent("personal_btnClick", { btnName: "学分抽奖" });
  },
  unreadNum() {
    app.user.unreadNum().then(res => {
      this.setData({
        showMes: res.data.unread_count
      });
    });
  }
});
