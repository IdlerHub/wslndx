const app = getApp()
// page/index/pages/topTeacher/topTeacher.js
Page({
  data: {
    list: []
  },
  isTopteacher: 1,
  isLogin: 1,
  onLoad: function (options) {
    this.params = {
      pageSize: 10,
      pageNum: 1
    }
    this.getlecturerList()
  },
  onShow: function () {
  },
  onReachBottom: function () {
    this.params.pageNum += 1
    this.getlecturerList(this.data.list)
  },
  onShareAppMessage: function (e) {
    if (e.from === "button") {
      let id = e.target.dataset.id
      return {
        title: "一起来学习网上老年大学讲师的课程吧!",
        imageUrl: this.data.$state.shareImgurl || "/images/sharemessage.jpg",
        path: "/page/index/pages/tearcherDetail/tearcherDetail?id=" +
          id +
          "&type=share&uid=" +
          this.data.$state.userInfo.id
      };
    } else {
      return this.menuAppShare()
    }
  },
  getlecturerList(list) {
    let arr = list || this.data.list
    app.lessonNew.lecturerList(this.params).then(res => {
      arr.push(...res.dataList)
      this.setData({
        list: arr
      })
    })
  },
  checkAttention(e) {
    let item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index
    if (!item.isFollowing) {
      app.liveData.follow({
        followerUid: item.uid
      }).then(res => {
        wx.showToast({
          icon: 'none',
          title: '关注成功'
        })
        this.setData({
          [`list[${index}].isFollowing`]: 1
        })
      })

    } else {
      wx.navigateTo({
        url: '/page/index/pages/tearcherDetail/tearcherDetail?id=' + item.uid,
      })
    }
  },
  toDetail(e) {
    let uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: '/page/index/pages/tearcherDetail/tearcherDetail?id=' + uid,
    })
  },
  checknextTap(e) {
    app.checknextTap(e)
  }
})