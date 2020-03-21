// pages/rankingList/rankingList.js
const app = getApp()
Page({
  data: {
    mode: 0,
    time: 0,
    rankType: 1,
    list:[],
    showRule: false,
    rule: '我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规'
  },
  onLoad: function (options) {
    let time = new Date()
    time =  app.util.formatTime(time).slice(0,10)
    this.setData({
      time
    })
    let list = [
      {id: 1 , name: '饭卡里说的就会发生挂号费快乐就好' , time: '26556.66W'},
      {id: 2 , name: '花开花落花满天' , time: '18623.58W'},
      {id: 3 , name: '花开花落花满天' , time: '150.98W'},
      {id: 4 , name: '很多咸鱼' , time: '30'},
      {id: 5 , name: '很多咸鱼' , time: '30'},
      {id: 6 , name: '很多咸鱼' , time: '30'},
      {id: 7 , name: '很多咸鱼' , time: '30'},
      {id: 8 , name: '很多咸鱼' , time: '30'},
      {id: 9 , name: '很多咸鱼' , time: '30'},
      {id: 10 , name: '很多咸鱼' , time: '30'},
      {id: 11 , name: '很多咸鱼' , time: '30'},
      {id: 12 , name: '很多咸鱼' , time: '30'},
    ]
    this.setData({
      list
    })
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {
  },
  check(e) {
    this.setData({
      mode: e.currentTarget.dataset.type
    })
  },
  checkTop(e) {
    this.setData({
      rankType: e.currentTarget.dataset.type
    })
  },
  openRule(e) {
    console.log(e)
    e.currentTarget.dataset.type ? this.setData({
      showRule: true
    }) :
    this.setData({
      showRule: false
    })
  },
  onShareAppMessage: function(ops, b) {
  },
})