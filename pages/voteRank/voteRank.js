/*
 * @Github: https://github.com/IdlerHub
 * @Author: zxk
 * @Date: 2020-05-13 12:42:53
 * @LastEditors: zxk
 * @LastEditTime: 2020-05-26 18:05:25
 */ 
// pages/voteRank/voteRank.js
const app = getApp();
Page({
  data: {
    topTitle: ["排名","学校","投票总数"],
    time: '00:00:00',
    rankList: [],
    title: ''
  },
  pageName: '赛事活动学校排行榜',
  onLoad: function (options) {
    wx.showLoading({
      title:'加载中'
    })
    this.getSchoolSortList();
  },
  getSchoolSortList(){
    app.vote.getSchoolSortList().then(res=>{
      wx.hideLoading();
      this.setData({
        rankList: res.data.list,
        time: res.data.time,
        title: res.data.title
      })
    })
    .catch(err=>{
      wx.showToast({
        title: '网络波动过大',
        icon: 'none'
      })
    })
  },
  onPullDownRefresh(){
    wx.showLoading({
      title: '加载中'
    })
    return Promise.all([this.getSchoolSortList()])
    .then(res=>{
      wx.stopPullDownRefresh()
    })
  },
  onShareAppMessage: function () {
    let title = this.data.title;
    return {
      title,
      path: `pages/vote/vote`,
    };
  }
})