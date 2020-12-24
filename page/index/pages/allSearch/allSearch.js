// page/index/pages/allSearch/allSearch.js
Page({
  data: {
    text: '',
    list: [],
    historyList: [],
    isSearch: 0
  },
  onLoad: function (ops) {
    this.setData({
      isLesson: ops.isLesson == 'true',
      isSchool: ops.isSchool == 'true',
      universityId: ops.universityId
    })
    wx.setNavigationBarTitle({
      title: ops.isSchool == 'true' ? '搜索高校' : '全部课程'
    })
    let that = this
    ops.isSchool == 'true' ? wx.getStorage({
      key: 'universityHistory',
      success(res) {
        that.setData({
          'historyList': res.data
        })
      }
    }) : wx.getStorage({
      key: 'lessonHistory',
      success(res) {
        that.setData({
          'historyList': res.data
        })
      }
    })
  },
  searchlesss(e) {
    this.selectComponent('#searchTop').setData({
      text: e.currentTarget.dataset.text
    },() => {
      this.selectComponent('#searchTop').searchlesss()
    })
  },
  toSchool(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/page/index/pages/allSchoollesson/allSchoollesson?id=${item.id}&title=${item.title}`,
    })
  },
  onReachBottom: function () {

  },
})