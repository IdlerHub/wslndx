/*
 * @Date: 2020-02-29 18:58:44
 * @LastEditors: hxz
 * @LastEditTime: 2020-03-06 13:45:47
 */
// pages/withdrawalRecord/withdrawalRecord.js
const app = getApp();
Page({
  data: {
    list: []
  },
  pageName: "邀请收学员提现记录页",
  onLoad: function(options) {
    app.tutor.extractAmount().then(res => {
      let list = res.data;
      list.forEach(item => {
        item.amount = Number(item.amount)
          .toFixed(2)
          .replace("-", "");
      });
      this.setData({
        list
      });
    });
  },
  onShow: function() {},
  onShareAppMessage: function() {}
});
