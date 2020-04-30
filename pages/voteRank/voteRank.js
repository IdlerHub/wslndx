// pages/voteRank/voteRank.js
const app = getApp();
Page({
  data: {
    time: '00:00:00',
    rankList: [],
    title: ''
  },
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
        title: '错误',
        icon: 'none'
      })
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