// pages/voteFail/voteFail.js
Page({

  data: {

  },
  reupload(){ // 跳转到上传作品页,并且填充作品??
    wx.redirectTo({
      url: "/pages/voteProduction/voteProduction"
    })
  },
  onLoad(options){
    console.log(options.item)
  }
})