// pages/messagePage/messagePage.js
const app = getApp()
var htmlparser = require("../../utils/htmlparser.js");

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
      let content = htmlparser.default(msg.data.content)
      this.setData({
        content
      })
    })
  }

})