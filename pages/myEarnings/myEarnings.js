// pages/myEarnings/myEarnings.js
const app = getApp()

Page({
  data: {
    list:[]
  },
  onLoad: function (options) {
    let list = [
      {'type_desc' : '收徒奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '收徒奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '收徒奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '收徒奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '收徒奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '收徒奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '收徒奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '收徒奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '收徒奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '收徒奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
      {'type_desc' : '收徒奖励' , 'amount': '0.1' , 'createtime': '1582507826'},
    ]
    list.forEach(v => {
      v.time = app.util.formatTime(new Date(v.createtime * 1000))
    })
    this.setData({
      list
    })
  },
  onReady: function () {
  },
  onShow: function () {
  },
  onShareAppMessage: function (ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button")
      return {
        title: this.data.$state.shareTitle || "福利！老年大学十万集免费课程在线学习",
        path: "/pages/loading/loading?uid=" + this.data.$state.userInfo.id + "&type=invite",
        imageUrl: this.data.$state.shareImgurl || "../../images/sharemessage.jpg"
      }
    }
  },
})