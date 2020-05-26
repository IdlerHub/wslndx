/*
 * @Date: 2020-03-04 12:20:44
 * @LastEditors: zxk
 * @LastEditTime: 2020-05-26 18:03:34
 */
// pages/voteFail/voteFail.js
Page({
  data: {},
  pageName: '赛事活动上传失败展示页',
  reupload() {
    // 跳转到上传作品页,并且填充作品??
    wx.redirectTo({
      url: "/pages/voteProduction/voteProduction"
    });
  },
  onLoad() {}
});
