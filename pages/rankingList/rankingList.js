// pages/rankingList/rankingList.js
const app = getApp()
Page({
  data: {
    mode: 0,
    time: 0,
    rankType: '0',
    list:[],
    showRule: false,
    rule: '我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规则我是用户规',
    shoolList: {
      0:[],
      1:[],
      2:[]
    },
    userList: {
      0:[],
      1:[],
      2:[]
    }
  },
  onLoad: function (options) {
    this.shoolPage = {
      0: {
        page:1, pageSize: 10, type: 'day'
      },
      1: {
        page:1, pageSize: 10, type: 'week'
      },
      2: {
        page:1, pageSize: 10, type: 'month'
      },
    }
    this.userPage = {
      0: {
        page:1, pageSize: 10, type: 'day'
      },
      1: {
        page:1, pageSize: 10, type: 'week'
      },
      2: {
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
      {id: 1 , nickname: '饭卡里说的就会发生挂号费快乐就好' , lesson_time: '256222451'},
      {id: 2 , nickname: '花开花落花满天' , lesson_time: '5123522224'},
      {id: 3 , nickname: '花开花落花满天' , lesson_time: '411122545'},
      {id: 4 , nickname: '很多咸鱼' , lesson_time: '30'},
      {id: 5 , nickname: '很多咸鱼' , lesson_time: '30'},
      {id: 6 , nickname: '很多咸鱼' , lesson_time: '30'},
      {id: 7 , nickname: '很多咸鱼' , lesson_time: '30'},
      {id: 8 , nickname: '很多咸鱼' , lesson_time: '30'},
      {id: 9 , nickname: '很多咸鱼' , lesson_time: '30'},
      {id: 10 , nickname: '很多咸鱼' , lesson_time: '30'},
      {id: 11 , nickname: '很多咸鱼' , lesson_time: '30'},
      {id: 12 , nickname: '很多咸鱼' , lesson_time: '30'},
    ]
    list.forEach(item => {
      item.times = app.util.towTwice(item.lesson_time)
    })
    // this.setData({
    //   list
    // })
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
    if(this.data.mode) {
      this.userPage[this.data.rankType].page ++ 
      let list = this.data.userList[this.data.rankType]
      app.user.getUserLessonTime(this.userPage[this.data.rankType]).then(res => {
        list = list.concat(res.data)
        this.setData({
          [`userList[${this.data.rankType}]`]: list
        })
      })
    } else {
      this.shoolPage[this.data.rankType].page ++ 
      let list = this.data.shoolList[this.data.rankType]
      app.user.getSchoolLessonTime(this.shoolPage[this.data.rankType]).then(res => {
        list = list.concat(res.data)
        this.setData({
          [`shoolList[${this.data.rankType}]`]: list
        })
      })
    }
  },
  onShareAppMessage: function () {
  },
  check(e) {
    this.setData({
      mode: e.currentTarget.dataset.type,
      rankType:0
    })
    if(e.currentTarget.dataset.type == 1) {
      if(this.data.userList[this.data.rankType][0]) return
      this.getUserList()
    } else {
      if(this.data.shoolList[this.data.rankType][0]) return
      this.getShoollist()
    }
  },
  checkTop(e) {
    this.setData({
      rankType: e.currentTarget.dataset.type
    })
    if(this.data.mode) {
      if(this.data.userList[this.data.rankType]) return
      this.getUserList()
    } else {
      if(this.data.shoolList[this.data.rankType]) return
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
    let txt = this.data.rankType
    app.user.getSchoolLessonTime(this.shoolPage[this.data.rankType]).then(res => {
      this.setData({
        [`shoolList[${txt}]`]: res.data
      })
    })
  },
  getUserList() {
    app.user.getUserLessonTime(this.userPage[this.data.rankType]).then(res => {
      this.setData({
        [`userList[${this.data.rankType}]`]: res.data
      })
    })
  }
})