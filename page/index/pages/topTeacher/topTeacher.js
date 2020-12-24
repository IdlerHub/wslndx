const app = getApp()
// page/index/pages/topTeacher/topTeacher.js
Page({
  data: {
    list: []
  },
  isTopteacher: 1,
  onLoad: function (options) {
    
  },
  onShow: function () {
    this.params = {
      pageSize: 10,
      pageNum: 1
    }
    this.getlecturerList()
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function (e) {
    if (e.from === "button") {
      let id = e.target.dataset.id
      return {
        title: "一起来学习网上老年大学讲师的课程吧!",
        imageUrl:  this.data.$state.shareImgurl || "/images/sharemessage.jpg",
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

    })
  },
  checkAttention(e) {
    let item = e.currentTarget.dataset.item, index = e.currentTarget.dataset.index
    if(!item.isChage) {
      this.setData({
        [`list[${index}].isChage`]: 1
      })
    } else {
      wx.navigateTo({
        url: '/page/index/pages/tearcherDetail/tearcherDetail?id=' + item.id,
      })
    }
  }
})