// pages/voteRule/voteRule.js
const app = getApp();
var htmlparser = require("../../utils/htmlparser.js");
Page({
  data: {
    rule: ''
  },
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