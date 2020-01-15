// pages/usermesseage/usermesseage.js
const app = getApp()
Page({
  data: {
    newsList:[]
  },
  onLoad: function (options) {
  },
  onShow: function () {
    this.getMessage()
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  tomessage(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/messagePage/messagePage?id=' + id,
    })
  },
  getMessage() {
    app.user.getMessage().then(res => {
      if(res.code == 1) {
        res.data.forEach(item => {
          if(item.content.indexOf('<img') > 0) {
            let texts=''
            texts+=item.content.substring('0',item.content.indexOf('<img')+4);//截取到<img前面的内容
            item.content = item.content.substring(item.content.indexOf('<img')+4);//<img 后面的内容
            if(item.content.indexOf('style=')!=-1 && item.content.indexOf('style=')<item.content.indexOf('>')){
              texts+=item.content.substring(0,item.content.indexOf('style="')+7)+"display:none;";//从 <img 后面的内容 截取到style= 加上自己要加的内容
              item.content=item.content.substring(item.content.indexOf('style="')+7); //style后面的内容拼接
            }else{
              texts+='style="display:none;" ';
            }
            texts+=item.content;//最后拼接的内容
            item.content = texts
          }
        })
        this.setData({
          newsList: res.data
        })
      }
    })
  }
})