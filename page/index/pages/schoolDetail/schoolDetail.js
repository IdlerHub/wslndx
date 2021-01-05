// page/index/pages/schoolDetail/schoolDetail.js
const app = getApp()
Page({
  data: {
    detail: {},
    liveList: [],
    lessonList: [],
    teacherList: [],
    showIntro: false
  },
  onLoad: function (ops) {
    this.setData({
      'detail.logo': ops.logo,
      'detail.name': ops.title,
      "detail.id": ops.id
    },() => {
      this.getList()
    })
  },
  onShow: function () {

  },
  onHide: function () {

  },
  getList() {
    let params = {
      universityId: this.data.detail.id,
      type: 1,
      pageSize: 10,
      pageNum: 1
    }
    app.lessonNew.getUniversityInfo({ id: this.data.detail.id }).then(res => {
      this.setData({
        detail: res.data
      })
    })
    app.liveData.hotList(params).then(res => {
      this.setData({
        liveList: res.dataList
      })
    })
    app.lessonNew.categoryLesson(params).then(res => {
      res.dataList = res.dataList.slice(0, 4)
      this.setData({
        lessonList: res.dataList
      })
    })
    app.lessonNew.lecturerList(params).then(res => {
      this.setData({
        teacherList: res.dataList
      })
    })
  },
  showIntro() {
    this.setData({
      showIntro: !this.data.showIntro
    })
  },
  toLivelesson(e) {
    let item = e.currentTarget.dataset.item
    app.liveData.getLiveBySpecialColumnId({
      specialColumnId: item.columnId
    }).then(res => {
      if(this.data.$state.userInfo.id) {
        wx.navigateTo({
          url: `/page/live/pages/vliveRoom/vliveRoom?roomId=${item.liveId}`,
        })
      } else if (!res.data.isAddSubscribe || !this.data.$state.userInfo.id) {
        wx.navigateTo({
          url: `/page/live/pages/tableDetail/tableDetail?specialColumnId=${item.columnId}`,
        })
      } else if(item.status == 2) {
        wx.navigateTo({
          url: `/page/live/pages/liveDetail/liveDetail?specialColumnId=${item.columnId}`,
        })
      }
    })
  },
  checknextTap(e) {
    app.checknextTap(e)
  }
})