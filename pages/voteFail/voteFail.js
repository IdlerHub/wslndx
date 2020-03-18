/*
 * @Date: 2020-03-04 12:20:44
 * @LastEditors: hxz
 * @LastEditTime: 2020-03-06 13:41:44
 */
// pages/voteFail/voteFail.js
Page({
  data: {},
  reupload() {
    // 跳转到上传作品页,并且填充作品??
    wx.redirectTo({
      url: "/pages/voteProduction/voteProduction"
    });
  },
  onLoad() {}
});
