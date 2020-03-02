// pages/experience/experience.js
const app = getApp()
Page({
  data: {
    article:{
      title:'体验官申请资格',
      content: ''
    }
  },
  pageName:'体验官申请',
  onLoad: function (options) {

  },
  onShow: function () {
    this.getArticle()
  },
  getArticle() {
    app.user.experienceArticle().then(res => {
      if(res.code == 1) {
        this.setData({
          article: res.data
        })
      }
    })
  }

})