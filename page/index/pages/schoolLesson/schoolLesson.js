// page/index/pages/schoolLesson/schoolLesson.jsccson
const app = getApp()
Page({
  data: {
    schoolList: []
  },
  params: {
    pageNum: 1,
    pageSize: 20
  },
  pageEnd: 0,
  isLogin: 1,
  onLoad: function (options) {
    this.getSchollList()
  },
  onShow: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    if(this.pageEnd) return
    this.params.pageNum += 1
    this.getSchollList()
  },
  getSchollList() {
    app.lessonNew.getSchollList(this.params).then(res => {
      res.dataList.length < 20 ? this.pageEnd = 1 : ''
      let schoolList = this.data.schoolList
      schoolList.push(...res.dataList)
      this.setData({
        schoolList
      })
    })
  }
})