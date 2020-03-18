/*
 * @Date: 2020-02-29 18:58:44
 * @LastEditors: hxz
 * @LastEditTime: 2020-03-06 11:25:20
 */
// pages/strategy/strategy.js
const app = getApp();
var htmlparser = require("../../utils/htmlparser.js");
Page({
  data: {
    current: 1
  },
  pageName: "收学员攻略页",
  onLoad: function(options) {
    app.tutor.explain().then(res => {
      let content = htmlparser.default(res.data.method_content),
        rule = htmlparser.default(res.data.rule_content);
      this.setData({
        content,
        rule
      });
    });
  },
  onShow: function() {},
  check(e) {
    e.currentTarget.dataset.type
      ? this.setData({
          current: 2
        })
      : this.setData({
          current: 1
        });
  }
});
