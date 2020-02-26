// pages/makeMoney/makeMoney.js
const app = getApp()
Page({
  data: {
    list:[],
    topMsg:{}
  },
  onLoad: function (options) {
    let list = [
      {name:'毁灭者',number:'158000', money:'98899',avatar:'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKKfMv43V8lvG8QepxjhicruE0QeerAq3VibgbdicR3fg57XZrocOUZ78QQJNZDr1wxg9jibn6Z46GNYg/132'},
      {name:'开心一下奥斯陆冬季受到了发货',number:'9888', money:'2',avatar:'https://wx.qlogo.cn/mmopen/vi_32/1ZCyMq0Ez6Ey1ncIv0uQJ2xclb9LlFFHpztA2LEX9o0YLLWG4hVic0gyYNVibQcNBTWAu6PA2nuiaDp6ms7dCjzPw/132'},
      {name:'卡我打',number:'7526', money:'868',avatar:''},
      {name:'卡我打',number:'7526', money:'868',avatar:''},
      {name:'毁灭者',number:'158000', money:'988',avatar:'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKKfMv43V8lvG8QepxjhicruE0QeerAq3VibgbdicR3fg57XZrocOUZ78QQJNZDr1wxg9jibn6Z46GNYg/132'},
      {name:'开心一下奥斯陆冬季受到了发货',number:'9888', money:'1',avatar:'https://wx.qlogo.cn/mmopen/vi_32/1ZCyMq0Ez6Ey1ncIv0uQJ2xclb9LlFFHpztA2LEX9o0YLLWG4hVic0gyYNVibQcNBTWAu6PA2nuiaDp6ms7dCjzPw/132'},
      {name:'毁灭者',number:'158000', money:'988',avatar:'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKKfMv43V8lvG8QepxjhicruE0QeerAq3VibgbdicR3fg57XZrocOUZ78QQJNZDr1wxg9jibn6Z46GNYg/132'},
      {name:'开心一下奥斯陆冬季受到了发货',number:'9888', money:'0.5',avatar:'https://wx.qlogo.cn/mmopen/vi_32/1ZCyMq0Ez6Ey1ncIv0uQJ2xclb9LlFFHpztA2LEX9o0YLLWG4hVic0gyYNVibQcNBTWAu6PA2nuiaDp6ms7dCjzPw/132'},
    ],
    topMsg = [{
      up:50,
      total:900
    },
    {
      up:100.8,
      total:35.9
    },
    {
      up:100,
      total:68200
    }]
    list.forEach( item => {
      item.number2 = app.util.towTwice(item.number)
      item.money2 = app.util.towTwice(item.money)
    })
    topMsg.forEach( item => {
      item.number2 = app.util.towTwice(item.total)
    })
    this.setData({
      list,
      topMsg
    })
  },
  onShow: function () {},
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function (ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button")
      return app.withdrawShare(ops)
    }
  },
})