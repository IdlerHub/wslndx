// page/discoveryHall/pages/index/index.js
const app = getApp()
Page({
  data: {
    showOverlay: false,
    overlayType: 0,
    stepsList: [],
    opusList: [],
    lessonList: [],
    newbie: []
  },
  pageName: 'discoveryHall',
  onLoad: function (options) {
    Promise.all([this.getStepList(), this.hallGetOpus(), this.hallGetColumnList(), this.hallGgetContentInfo()])
    app.globalData.scorePage = true
  },
  onShow: async function () {
    await this.getStepList()
    this.data.$state.userInfo.id ? await app.getTaskStatus() : null
    await this.setTask()
  },
  onUnload() {
    app.globalData.scorePage = false
  },
  onShareAppMessage: function (ops) {
    return {
      title: '新生体验营，邀你一起来网上老年大学开启新的学习旅程！',
      imageUrl: '../../images/shareImg.png',
      path: "/page/discoveryHall/pages/index/index?type=share&uid=" + this.data.$state.userInfo.id
    }
  },
  // 新手任务
  setTask() {
    let newbie = [{
          title: "完善资料",
          score: 10,
          status: false,
          page: "/page/user/pages/info/info",
          authorization: false,
          login: 1,
          showStatus: {
            name: "finish_user_info_status",
            status: false
          },
        },
        {
          title: "完成[云课堂]新手指引",
          score: 5,
          status: false,
          page: "/page/index/pages/allLesson/allLesson",
          authorization: false,
          login: 1,
          showStatus: {
            name: "lesson_guide_status",
            status: false
          }
        },
        {
          title: "首次学习课程",
          score: 5,
          status: false,
          page: "/page/index/pages/allLesson/allLesson",
          authorization: false,
          showStatus: {
            name: "first_learn_status",
            status: false
          },
          isNotab: 1
        },
        {
          title: "完成[短视频]新手指引",
          score: 5,
          status: false,
          page: "/pages/video/video",
          authorization: false,
          login: 1,
          showStatus: {
            name: "shortvideo_guide_status",
            status: false
          },
          isNotab: 1
        },
        {
          title: "短视频首次点赞",
          score: 5,
          status: false,
          page: "/pages/video/video",
          authorization: false,
          showStatus: {
            name: "first_shortvideo_parise_status",
            status: false
          },
          isNotab: 1
        },
        {
          title: "完成[秀风采]新手指引",
          score: 5,
          status: false,
          page: "/pages/post/post",
          login: 1,
          authorization: true,
          showStatus: {
            name: "boke_guide_status",
            status: false
          }
        },
        {
          title: "首次发帖",
          score: 5,
          status: false,
          page: "/pages/post/post",
          authorization: true,
          login: 1,
          showStatus: {
            name: "first_add_boke_status",
            status: false
          }
        },
        {
          title: "秀风采首次点赞",
          score: 5,
          status: false,
          page: "/pages/post/post",
          authorization: true,
          login: 1,
          showStatus: {
            name: "first_boke_prise_status",
            status: false
          }
        },
        {
          title: "秀风采首次评论",
          score: 5,
          status: false,
          page: "/pages/post/post",
          authorization: true,
          login: 1,
          showStatus: {
            name: "first_boke_comment_status",
            status: false
          }
        }
      ],
      brr = []
    this.data.$state.userInfo.id ?  newbie.forEach((item, index) => {
      brr.push(Object.assign(newbie[index], {
        isCompleted: this.data.$state.taskStatus[item.showStatus.name]
      }));
    }) : brr = newbie
    this.setData({
      newbie: brr
    })
  },
  // 获取优秀作品
  hallGetOpus() {
    app.activity.hallGetOpus({
      pageSize: 6,
      pageNum: 1
    }).then(res => {
      this.setData({
        opusList: res.dataList
      })
    })
  },
  // 规则显示隐藏
  onClickHid(e) {
    this.setData({
      showOverlay: !this.data.showOverlay,
      overlayType: Number(e.currentTarget.dataset.type)
    })
  },
  getStepList() {
    app.activity.hallGetTaskPointInfo().then(res => {
      this.setData({
        stepsList: res.dataList
      })
    })
  },
  hallGetColumnList() {
    app.lessonNew.hallGetColumnList({
      pageSize: 4,
      pageNum: 1
    }).then(res => {
      this.setData({
        lessonList: res.dataList
      })
    })
  },
  hallGgetContentInfo() {
    app.activity.hallGgetContentInfo().then(res => {
      this.setData({
        inro: res.data
      })
    })
  },
  getScore(e) {
    let index = e.currentTarget.dataset.index,
      url = ''
    if (this.data.stepsList[index].isCompleted) return
    switch (this.data.stepsList[index].type) {
      case 1:
        url = '/page/discoveryHall/pages/works/works'
        break;
      case 2:
        url = '/page/index/pages/charityLesson/charityLesson?name=热门'
        break;
      case 3:
        url = '/page/discoveryHall/pages/detail/detail?isOn=1'
        break;
    }
    wx.navigateTo({
      url,
    })
  },
  scoreGet(e) {
    let index = e.currentTarget.dataset.index
    if (this.data.newbie[index].isCompleted) return
    if (this.data.newbie[index].title == "完善资料" || this.data.newbie[index].isNotab) {
      wx.navigateTo({
        url: this.data.newbie[index].page
      });
    } else {
      wx.switchTab({
        url: this.data.newbie[index].page
      });
    }
  },
  toLesson(e) {
    app.liveAddStatus(e.currentTarget.dataset.item.columnId, e.currentTarget.dataset.item.isCharge, e.currentTarget.dataset.item.id)
  },
  toLoade() {
    wx.navigateTo({
      url: '/pages/education/education?type=0&login=1&url=https://mp.weixin.qq.com/s/vSd8XBQDQkvqVX_kt_YyTQ',
    })
  },
  // 用户昵称等信息授权
  onGotUserInfo(e) {
    let index = e.currentTarget.dataset.index
    wx.getUserProfile({
      desc: '请授权您的个人信息便于更新资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.updateBase(res)
        if (this.data.newbie[index].title == "完善资料" || this.data.newbie[index].isNotab) {
          wx.navigateTo({
            url: this.data.newbie[index].page
          });
        } else {
          wx.switchTab({
            url: this.data.newbie[index].page
          });
        }
      }
    })
  },
  checknextTap(e) {
    app.checknextTap(e);
  },
})