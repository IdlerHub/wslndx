// pages/rankingList/rankingList.js
const app = getApp()
Page({
  data: {
    mode: 0,
    time: 0,
    rankType: 'day',
    list:[],
    showRule: false,
    rule: '我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规',
    shoolList: {
      day:[],
      week:[],
      month:[]
    },
    userList: {
      day:[],
      week:[],
      month:[]
    }
  },
  onLoad: function (options) {
    this.shoolPage = {
      day: {
        page:1, pageSize: 10, type: 'day'
      },
      week: {
        page:1, pageSize: 10, type: 'week'
      },
      month: {
        page:1, pageSize: 10, type: 'month'
      },
    }
    this.userPage = {
      day: {
        page:1, pageSize: 10, type: 'day'
      },
      week: {
        page:1, pageSize: 10, type: 'week'
      },
      month: {
        page:1, pageSize: 10, type: 'month'
      },
    }
    let time = new Date()
    time =  app.util.formatTime(time).slice(0,10)
    this.setData({
      time
    })
    this.getShoollist()
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
    if(this.data.mode) {

    } else {
      if(this.data.shoolList[this.data.rankType][0]) return
      this.getShoollist()
    }
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
  getShoollist() {
    app.user.getSchoolLessonTime(this.shoolPage[this.data.rankType]).then(res => {
      this.setData({
        [`shoolList[${this.data.rankType}]`]: res.data
      })
    })
  }
})