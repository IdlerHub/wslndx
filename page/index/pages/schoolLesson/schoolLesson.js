// page/index/pages/schoolLesson/schoolLesson.jsccson
const app = getApp()
Page({
  data: {
    schoolList: [],
    detail: null
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
    console.log(app.store.$state)
    app.store.$state.userInfo.id ? this.getcountVideo() : ''
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
  getcountVideo() {
    app.lessonNew.countVideo().then(res => {
      this.setData({
        detail: res.data
      })
    }).catch(msg => {
      
    })
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