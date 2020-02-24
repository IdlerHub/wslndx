// pages/myApprentice/myApprentice.js
Page({
  data: {
    list:[]
  },
  onLoad: function (options) {
    let list = [
      {name:'毁灭者',number:'158000', money:'988',avatar:'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKKfMv43V8lvG8QepxjhicruE0QeerAq3VibgbdicR3fg57XZrocOUZ78QQJNZDr1wxg9jibn6Z46GNYg/132',createtimes:'2019-09-21',time:'10:40'},
      {name:'开心一下奥斯陆冬季受到了发货',number:'9888', money:'868',avatar:'https://wx.qlogo.cn/mmopen/vi_32/1ZCyMq0Ez6Ey1ncIv0uQJ2xclb9LlFFHpztA2LEX9o0YLLWG4hVic0gyYNVibQcNBTWAu6PA2nuiaDp6ms7dCjzPw/132',createtimes:'2019-09-21',time:'10:40'},
      {name:'卡我打',number:'7526', money:'868',avatar:'',createtimes:'2019-09-21',time:'10:40'},
      {name:'卡我打',number:'7526', money:'868',avatar:'',createtimes:'2019-09-21',time:'10:40'},
      {name:'毁灭者',number:'158000', money:'988',avatar:'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKKfMv43V8lvG8QepxjhicruE0QeerAq3VibgbdicR3fg57XZrocOUZ78QQJNZDr1wxg9jibn6Z46GNYg/132',createtimes:'2019-09-21',time:'10:40'},
      {name:'开心一下奥斯陆冬季受到了发货',number:'9888', money:'868',avatar:'https://wx.qlogo.cn/mmopen/vi_32/1ZCyMq0Ez6Ey1ncIv0uQJ2xclb9LlFFHpztA2LEX9o0YLLWG4hVic0gyYNVibQcNBTWAu6PA2nuiaDp6ms7dCjzPw/132',createtimes:'2019-09-21',time:'10:40'},
      {name:'毁灭者',number:'158000', money:'988',avatar:'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKKfMv43V8lvG8QepxjhicruE0QeerAq3VibgbdicR3fg57XZrocOUZ78QQJNZDr1wxg9jibn6Z46GNYg/132',createtimes:'2019-09-21',time:'10:40'},
      {name:'开心一下奥斯陆冬季受到了发货',number:'9888', money:'868',avatar:'https://wx.qlogo.cn/mmopen/vi_32/1ZCyMq0Ez6Ey1ncIv0uQJ2xclb9LlFFHpztA2LEX9o0YLLWG4hVic0gyYNVibQcNBTWAu6PA2nuiaDp6ms7dCjzPw/132',createtimes:'2019-09-21',time:'10:40'},
    ]
    this.setData({
      list
    })
  },
  onShow: function () {},
  onUnload: function () {},
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