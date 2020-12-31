// page/index/pages/tearcherDetail/tearcherDetail.js
const app = getApp()
Page({
  data: {
    statusBarHeight: 0,
    top: 0,
    topBox: 0,
    showTab: 0,
    lessonList: [],
    info: {

    }
  },
  params: {
    pageSize: 50,
    pageNum: 1
  },
  onLoad: function (options) {
    this.params.uid = options.id
    this.setData({
      statusBarHeight: wx.getSystemInfoSync().statusBarHeight
    })
    this.getHetght()
    this.getInfo()
    this.getLesson()
  },
  onShow: function () {

  },
  onShareAppMessage: function () {
    return {
      title: "一起来学习网上老年大学讲师的课程吧!",
      imageUrl: this.data.$state.shareImgurl || "/images/sharemessage.jpg",
      path: "/page/index/pages/tearcherDetail/tearcherDetail?id=" +
        id +
        "&type=share&uid=" +
        this.data.$state.userInfo.id
    };
  },
  getHetght() {
    let query = wx.createSelectorQuery().in(this)
    let that = this
    query.select('.topBox').boundingClientRect()
    query.exec(res => {
      console.log(res)
      this.setData({
        topBox: res[0].height
      })
    })
  },
  getTabtop() {
    let query = wx.createSelectorQuery().in(this)
    let that = this
    query.select('#tabBox').boundingClientRect()
    query.exec(res => {
      this.setData({
        showTab: res[0].top < this.data.top ? 1 : 0
      })
    })
  },
  bindscroll(e) {
    this.setData({
      scroll: e.detail.scrollTop
    }, () => {
      this.data.top > 0 ? '' : this.setData({
        top: this.selectComponent('#navigationBar').data.height + this.selectComponent('#navigationBar').data.paddingTop
      })
      this.getTabtop()
    })
  },
  bindscrolltolower() {
    this.params.pageNum += 1
    this.getLesson()
  },
  back() {
    let pages = getCurrentPages()
    pages.length > 1 ? wx.navigateBack() : wx.switchTab({
      url: '/pages/index/index',
    })
  },
  getInfo() {
    app.user.getOtherUser({
      userId: this.params.uid
    }).then(res => {
      this.setData({
        info: res.data
      })
    })
  },
  getLesson() {
    let arr = this.data.lessonList
    app.liveData.lecturerList(this.params).then(res => {
      arr.push(...res.dataList)
      this.setData({
        lessonList: arr
      })
    })
  },
  checkAttention() {
    let pages = getCurrentPages().length > 1 ? getCurrentPages()[getCurrentPages().length - 2] : null
    if (this.data.info.isFollowing) {
      app.liveData.cancelFollow({
        followerUid: this.data.info.id
      }).then(res => {
        this.setData({
          'info.isFollowing': 0
        })
        console.log(pages)
        pages.data.list.forEach((item, index) => {
          item.uid == this.data.info.id ? pages.setData({
            [`list[${index}].isFollowing`]: 0
          }) : ''
        })
      })
    } else {
      app.liveData.follow({
        followerUid: this.data.info.id
      }).then(res => {
        wx.showToast({
          icon: 'none',
          title: '关注成功'
        })
        this.setData({
          'info.isFollowing': 1
        })
        if (pages) {
          pages.data.list.forEach((item, index) => {
            item.uid == this.data.info.id ? pages.setData({
              [`list[${index}].isFollowing`]: 1
            }) : ''
          })
        }
      })
    }
  },
  detailTap(e) {
    let item = e.currentTarget.dataset.item
    app.liveData.getLiveBySpecialColumnId({
      specialColumnId: item.columnId
    }).then(res => {
      if(item.isCharge) {
        wx.navigateTo({
          url: `/page/index/pages/chageLesson/chageLesson?id=${item.columnId}`,
        })
      } else if (!res.data.isAddSubscribe) {
        wx.navigateTo({
          url: `/page/live/pages/tableDetail/tableDetail?specialColumnId=${item.columnId}`,
        })
      } else {
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