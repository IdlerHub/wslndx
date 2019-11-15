/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-13 15:08:19
 */
const app = getApp()
//Page Object
Page({
  data: {
    currentTab: 1,
    scrollStatus: false,
    paylist: [],
    details: [],
    newgift: [{
      add_id: 0,
      createtime: 1557222609,
      edit_id: 0,
      exchange: 9,
      id: 14,
      image:"https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/ca68f2ab076f09395e4ccd4d73aafa91.jpg",
      need_points: 1200,
      remarks: "创意笔记本",
      status: 1,
      stock: 21,
      title: "创意笔记本",
      weigh: 14,
    }, {
      add_id: 0,
      createtime: 1557222577,
      edit_id: 0,
      exchange: 2,
      id: 13,
      image: "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/ddc4d174893ff518c30d5a193ea8472e.jpg",
      need_points: 1400,
      remarks: "中国结（小挂饰）",
      status: 1,
      stock: 23,
      title: "中国结（小挂饰）",
      weigh: 13
    }],
    singnow: false,
    singafter: false,
    isRefreshing: false,
    showHome: false,
    showSignbox: false
  },
  common: {
    scrollTop: 175
  },
  //options(Object)
  onLoad: function(options) {
    console.log(options)
    options.type !== 'index' ? this.setData({
      showHome: true
    }) : this.setData({
      showHome: false
    })

  },
  onShow: function() {
    let sources = [{
          title: "邀请好友注册",
          score: 25,
          status: false,
          page: "/pages/invitation/invitation",
          authorization: false,
          showStatus: {
            name: '',
            status: false
          }
        },
        {
          title: "学完一门新课程",
          score: 20,
          status: false,
          page: "/pages/index/index?tabs=1",
          authorization: false,
          showStatus: {
            name: '',
            status: false
          }
        },
        {
          title: "每日短视频首赞",
          score: 20,
          status: false,
          page: "/pages/video/video",
          authorization: false,
          showStatus: {
            name: 'day_shortvideo_praise_status',
            status: false
          }
        },
        {
          title: "每日秀风采首次发帖",
          score: 20,
          status: false,
          page: "/pages/post/post",
          authorization: true,
          showStatus: {
            name: 'day_add_boke_status',
            status: false
          }
        },
        {
          title: "每日秀风采首评",
          score: 20,
          status: false,
          page: "/pages/post/post",
          authorization: true,
          showStatus: {
            name: 'day_boke_comment_status',
            status: false
          }
        },
        {
          title: "每日签到",
          score: 20,
          status: false,
          authorization: false,
          showStatus: {
            name: 'shortvideo_guide_status',
            status: false
          }
        }
      ],
      newbie = [{
          title: "完善资料",
          score: 65,
          status: false,
          page: "/pages/info/info",
          authorization: false,
          showStatus:{
            name: 'finish_user_info_status',
            status: false
          }  
        },
        {
          title: "完成[云课堂]新手指引",
          score: 45,
          status: false,
          page: "/pages/index/index?tabs=0",
          authorization: false,
          showStatus: {
            name: 'lesson_guide_status',
            status: false
          }
        },
        {
          title: "首次学习课程",
          score: 70,
          status: false,
          page: "/pages/index/index?tabs=0",
          authorization: false,
          showStatus: {
            name: 'first_learn_status',
            status:false
          }
        },
        {
          title: "完成[短视频]新手指引",
          score: 45,
          status: false,
          page: "/pages/video/video",
          authorization: false,
          showStatus: {
            name: 'shortvideo_guide_status',
            status: false
          }
        },
        {
          title: "短视频首次点赞",
          score: 50,
          status: false,
          page: "/pages/video/video",
          authorization: false,
          showStatus: {
            name:'first_shortvideo_parise_status',
            status:false
          }
        },
        {
          title: "完成[秀风采]新手指引",
          score: 45,
          status: false,
          page: "/pages/post/post",
          authorization: true,
          showStatus: {
            name: 'boke_guide_status',
            status: false
          }
        },
        {
          title: "首次发帖",
          score: 50,
          status: false,
          page: "/pages/post/post",
          authorization: true,
          showStatus: {
            name: 'first_add_boke_status',
            status: false
          }
        },
        {
          title: "秀风采首次点赞",
          score: 50,
          status: false,
          page: "/pages/post/post",
          authorization: true,
          showStatus: {
            name:'first_boke_prise_status',
            status: false
          }
        },
        {
          title: "秀风采首次评论",
          score: 50,
          status: false,
          page: "/pages/post/post",
          authorization: true,
          showStatus: {
            name: 'first_boke_comment_status',
            status: false
          }
        }
      ]
    this.setData({
      sources,
      newbie
    })
    this.params = {
      page: 1,
      pageSize: 10
    }
    // this.init()
    Promise.all([this.init(), this.getGift()]).then(value => {
      let arr = [],brr=[],crr=[]
      if (this.data.$state.authUserInfo) {
        this.data.sources.forEach((item, index) => {
          if (this.data.$state.dayStatus[item.showStatus.name]) {
            item.status = true
          }
          item.status ? arr.push(this.data.sources[index]) : ''
          !item.status ? crr.push(this.data.sources[index]) : ''
          item.authorization = false
        })
      } else {
        this.data.sources.forEach((item, index) => {
          if (this.data.$state.dayStatus[item.showStatus.name]) {
             item.status = true
          }
          item.status ? arr.push(this.data.sources[index]) : ''
          !item.status ? crr.push(this.data.sources[index]) : ''
        })
      }
      this.data.newbie.forEach((item, index) => {
        // console.log(this.data.$state.taskStatus[item.showStatus.name])
        if(this.data.$state.taskStatus[item.showStatus.name] == 0) {
          brr.push(...this.data.newbie.splice(index, 1)) 
        }
      })
      arr = crr.concat(arr)
      this.setData({
        sources: arr,
        newbie: brr
      })
    })
  },
  init() {
    if (this.params.end) return Promise.resolve()
    return app.user.pointsinfo(this.params).then(res => {
      if (res.code == 1) {
        res.data.lists.forEach(v => {
          v.time = app.util.formatTime(new Date(v.createtime * 1000))
        })
        if (this.params.page == 1) {
          /* 每天分享课程最多3次获取积分 */
          // let shareCount = res.data.lists.filter(item => {
          //   return item.type == "SHARE_LESSON" && item.createtime * 1000 > new Date(new Date().toLocaleDateString()).getTime()
          // }).length
          // let remain = 3 - shareCount
          // let sources = this.data.sources
          // sources.forEach((item, index) => {
          //   if (item.title == '分享课程') {
          //     item.times = remain > 0 ? remain : 0
          //     item.status = remain <= 0
          //   }
          // })

          this.setData({
            totalPoints: res.data.mypoints,
            details: res.data.lists
          })
        } else {
          if (res.data.lists.length < this.params.pageSize) this.params.end = true
          this.setData({
            details: this.data.details.concat(res.data.lists)
          })
        }
      }
    })
  },
  getGift() {
    app.user.gift().then(res => {
      if (res.code == 1) {
        res.data.forEach(item => {
          item.largePoint = item.need_points >= 10000 ? (item.need_points / 10000).toFixed(2) + "w" : null
        })
        let sources = this.data.sources
        let arr = []
        sources.forEach((item, index) => {
          item.title == '每日签到' ? item.status = this.data.$state.signStatus.status : ''
        })
        this.setData({
          paylist: res.data,
          sources /* 用户签到状态 */
        })
      }
    })
  },
  onHide: function() {},
  onPullDownRefresh: function() {
    this.setData({
      isRefreshing: true
    })
    this.params = {
      page: 1,
      pageSize: 10
    }
    this.init().then(() => {
      wx.stopPullDownRefresh()
      this.setData({
        isRefreshing: false
      })
    })
  },
  onReachBottom: function() {
    this.setData({
      scrollStatus: true
    })
  },
  onPageScroll: function(e) {
    if (e.scrollTop < this.common.scrollTop) {
      this.data.scrollStatus && this.setData({
        scrollStatus: false
      })
    }
  },
  lower() {
    this.params.page += 1
    this.init()
  },
  switchTap(e) {
    let id = e.currentTarget.dataset.index
    if (id != this.data.currentTab) {
      this.setData({
        currentTab: id
      })
    }
  },
  swiperChange(e) {
    let id = e.detail.currentItemId
    if (id != this.data.currentTab) {
      this.setData({
        currentTab: id
      })
    }
  },
  gift(e) {
    if (!e.currentTarget.dataset.stock) {
      wx.showToast({
        title: "已经没货啦～",
        icon: "none",
        duration: 1500
      })
    } else {
      if (this.data.totalPoints >= e.currentTarget.dataset.score) {
        let param = {
          gift_id: e.currentTarget.dataset.id
        }
        if (e.currentTarget.dataset.type) {
          wx.showModal({
            content: "新手专享只能兑换一次，是否选择该商品？",
            showCancel: true,
            cancelText: "取消",
            cancelColor: "#000000",
            confirmText: "确认",
            confirmColor: "#df2020",
            success: res => {
              if (res.confirm) {
                app.user.exchange(param).then(res => {
                  if (res.code == 1) {
                    wx.navigateTo({
                      url: "/pages/gift/gift"
                    })
                  }
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: "兑换提示",
            content: "确定要兑换该物品吗?",
            showCancel: true,
            cancelText: "暂时不换",
            cancelColor: "#000000",
            confirmText: "确定兑换",
            confirmColor: "#df2020",
            success: res => {
              if (res.confirm) {
                app.user.exchange(param).then(res => {
                  if (res.code == 1) {
                    wx.navigateTo({
                      url: "/pages/gift/gift"
                    })
                  }
                })
              }
            }
          })
        }
      } else {
        wx.showToast({
          title: "您的积分不够兑换!",
          icon: "none",
          duration: 1500
        })
      }
    }
  },
  nav(e) {
    let i = e.currentTarget.dataset.index
    let name = e.currentTarget.dataset.title
    if (name == '每日签到') {
      /* 签到状态 */
      // app.setSignIn({
      //   status: true,
      //   count: 1
      // }, true)
      this.data.sources.forEach(item => {
        item.title == '每日签到' ? item.status = true : ''
      })
      this.setData({
        sources: this.data.sources
      })
      this.setData({
        showSignbox: true
      })
      this.params = {
        page: 1,
        pageSize: 10
      }
      // this.init()
      // this.getGift()
      // app.user.sign().then(res => {
      //   this.init()
      // })
    } else {
      if (i != 0) {
        app.globalData.currentTab = 1
        wx.switchTab({
          url: this.data.sources[i].page
        })
      } else {
        wx.navigateTo({
          url: this.data.sources[i].page
        })
      }
    }
  },
  tabnav(e) {
    let i = e.currentTarget.dataset.index
    let name = e.currentTarget.dataset.title
    if (name == '完善资料') {
      wx.navigateTo({
        url: this.data.newbie[i].page
      })
    } else {
      wx.switchTab({
        url: this.data.newbie[i].page
      })
    }
  },
  toDraw() {
    wx: wx.navigateTo({
      url: '/pages/drawPage/drawPage',
    })
  },
  onGotUserInfo(e) {
    if (e.detail.errMsg === "getUserInfo:ok") {
      app.updateBase(e)
      wx.switchTab({
        url: '/pages/post/post',
      })
    }
  },
  // 弹出签到框
  showSingbox() {
    this.setData({
      showSignbox: true
    })
  },
  closesignBox() {
    this.setData({
      showSignbox: false
    })
  },
  toMessage(e) {
    let item = e.currentTarget.dataset.item
    console.log(item)
    wx.navigateTo({
      url: '/pages/giftMessage/giftMessage?content=' + JSON.stringify(item) + "&totalPoints=" + this.data.totalPoints,
    })
  }
})