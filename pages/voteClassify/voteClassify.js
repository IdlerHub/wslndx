// pages/voteClassify/voteClassify.js
const app = getApp();
Page({
  data: {
    classifyList: [{ id: '0', name: '全部' }],
    selectedIndex: 0,
  },
  toVote(e){
    let list = getCurrentPages();
    const page = list[list.length - 2];
    page.changeData(e.currentTarget.dataset.index, e.currentTarget.dataset.type)
    wx.navigateBack()
    // wx.redirectTo({
    //   url: `/pages/vote/vote?index=${e.currentTarget.dataset.index}&type=${e.currentTarget.dataset.type} `
    // })
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
  getCategory(){
    var data = this.data.classifyList;
    app.vote.getCategory().then(res => {
      console.log(res)
      this.setData({
        classifyList: data.concat(res.data)
      })
    })
  },
  onLoad(){
    let pages = getCurrentPages();
    this.beforePage = pages[0];
    console.log("页面路径??",pages)
    this.getCategory()
  }
})