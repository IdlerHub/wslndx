// pages/voteClassify/voteClassify.js
Page({
  data: {
    classifyList: ['全部', '书法绘画', '花艺', '园林', '书法绘画', '花艺', '花艺']
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
})