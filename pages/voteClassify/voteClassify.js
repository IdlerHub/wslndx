// pages/voteClassify/voteClassify.js
const app = getApp();
Page({
  data: {
    classifyList: [{ id: '0', name: '全部' }],
    selectedIndex: 0,
  },
  toVote(e){
    wx.redirectTo({
      url: `/pages/vote/vote?index=${e.currentTarget.dataset.index}&type=${e.currentTarget.dataset.type} `
    })
  },
  join() {
    wx.navigateTo({
      url: "/pages/voteProduction/voteProduction"
    })
  },
  works() {
    wx.navigateTo({
      url: "/pages/myProduction/myProduction"
    })
  },
  onLoad(){
    var data = this.data.classifyList;
    app.vote.getCategory().then(res => {
      console.log(res)
      this.setData({
        classifyList: data.concat(res.data)
      })
    })
  }
})