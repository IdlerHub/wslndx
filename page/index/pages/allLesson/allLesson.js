// page/index/pages/allLesson/allLesson.js
const app = getApp()
Page({
  data: {
    current: 0,
    tabCurrent: 0,
    crumbs: {
      tab1: '',
      tab2: ''
    },
    lessonList: [],
    scrollTop: 0
  },
  pageEnd: 0,
  isLogin: 1,
  onLoad: function (options) {
    this.params = {
      categoryId: '',
      pageSize: 20, 
      pageNum: 1
    }
    this.getAllCategory()
  },
  onHide: function () {

  },
  onUnload() {
    return
  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  getAllCategory() {
    app.lessonNew.getAllCategory().then(res => {
      this.setData({
        navList: res.dataList
      })
    })
  },
  navChange(e) {
    let index = e.currentTarget.dataset.index, id = e.currentTarget.id
    this.setData({
      scrollTop: 0,
      current: index
    })
  },
  swiperChange(e) {
    if(e.detail.current == this.data.current) return
    this.setData({
      scrollTop: 0,
      current: e.detail.current
    })
  },
  catchtouchmove() {
    return false
  },
  checkTab(e, i) {
    let categoryId = e.currentTarget.dataset.id, tab1 = e.currentTarget.dataset.tab1, tab2 = e.currentTarget.dataset.tab2
    this.setData({
      tabCurrent: !this.data.tabCurrent,
      'crumbs.tab1': tab1,
      'crumbs.tab2': tab2,
      lessonList: []
    }, () => {
      this.data.tabCurrent ? wx.setNavigationBarTitle({
        title: tab2
      }) : wx.setNavigationBarTitle({
        title: '全部课程'
      })
      this.params = {
        pageSize: 20, 
        pageNum: 1
      }
      this.pageEnd = 0
      if(!categoryId) return
      this.categoryLessonOrLive(categoryId)
    })
  },
  categoryLessonOrLive(categoryId) {
    this.params.categoryId = categoryId
    app.lessonNew.categoryLessonOrLive(this.params).then(res => {
      let lessonList = this.data.lessonList
      res.dataList.forEach(function (item) {
        item.thousand = app.util.tow(item.browse)
      })
      lessonList.push(...res.dataList)
      this.setData({
        lessonList
      }, () => {
        res.dataList.length < 20 ? this.pageEnd = 1 : ''
      })
    })
  },
  scrolltolower() {
    if(this.pageEnd) return
    this.params.pageNum += 1
    this.categoryLessonOrLive(this.params.categoryId)
  }
})