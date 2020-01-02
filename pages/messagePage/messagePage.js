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
      this.setData({
        content: msg.data.content
      })
    })
  }

})