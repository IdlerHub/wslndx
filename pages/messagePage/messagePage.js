// pages/messagePage/messagePage.js
const app = getApp()
Page({
  data: {

  },
  onLoad: function (ops) {
    let id = ops.id
    this.getMessage(id)
  },
  getMessage(id) {
    let param = { id }
    app.user.messageDetail(param).then(msg => {
      wx.setNavigationBarTitle({
        title: msg.data.title,
      })
      if(msg.data.content.indexOf('<img') > 0) {
        let texts=''
        texts+=msg.data.content.substring('0',msg.data.content.indexOf('<img')+4);//截取到<img前面的内容
        msg.data.content = msg.data.content.substring(msg.data.content.indexOf('<img')+4);//<img 后面的内容
        if(msg.data.content.indexOf('style=')!=-1 && msg.data.content.indexOf('style=')<msg.data.content.indexOf('>')){
          texts+=msg.data.content.substring(0,msg.data.content.indexOf('style="')+7)+"margin:0 auto";//从 <img 后面的内容 截取到style= 加上自己要加的内容
          msg.data.content=msg.data.content.substring(msg.data.content.indexOf('style="')+7); //style后面的内容拼接
        }else{
          texts+='margin:0 auto" ';
        }
        texts+=msg.data.content;//最后拼接的内容
        msg.data.content = texts
      }
      this.setData({
        content: msg.data.content
      })
    })
  }

})