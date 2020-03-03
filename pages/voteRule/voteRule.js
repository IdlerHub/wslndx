// pages/voteRule/voteRule.js
const app = getApp();
Page({
  data: {
    rule: ''
  },
  getRule(){  //获取活动规则
    let that = this;
    app.vote.getH5Rule().then(res=>{
      that.setData({
        rule: res.data.rule
      })
    })
  },
  onLoad(){
    this.getRule()
  }
})