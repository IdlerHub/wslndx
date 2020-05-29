/*
 * @Github: https://github.com/IdlerHub
 * @Author: zxk
 * @Date: 2020-05-13 12:42:53
 * @LastEditors: zxk
 * @LastEditTime: 2020-05-26 18:01:24
 */ 
// pages/voteRule/voteRule.js
const app = getApp();
var htmlparser = require("../../utils/htmlparser.js");
Page({
  data: {
    rule: ''
  },
  pageName: '赛事活动规则页',
  getRule(){  //获取活动规则
    let that = this;
    app.vote.getH5Rule().then(res=>{
      let content = htmlparser.default(res.data.rule)
      this.setData({
        rule: content
      })
    })
  },
  onLoad(){
    this.getRule()
  }
})