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
  getAllCategory: async function () {
    let list = (await app.lessonNew.miniSemesterList()).dataList
    await app.lessonNew.getAllCategory().then(res => {
      this.setData({
        navList: [{
          id: 0,
          name: '好课推荐',
          list
        }, ...res.dataList]
      })
    })
  },
  navChange(e) {
    let index = e.currentTarget.dataset.index,
      id = e.currentTarget.id
    this.setData({
      scrollTop: 0,
      current: index
    })
  },
  swiperChange(e) {
    if (e.detail.current == this.data.current) return
    this.setData({
      scrollTop: 0,
      current: e.detail.current
    })
  },
  catchtouchmove() {
    return false
  },
  checkTab(e, i) {
    let categoryId = e.currentTarget.dataset.id,
      index = e.currentTarget.dataset.index,
      current = e.currentTarget.dataset.idx
    wx.navigateTo({
      url: `/page/index/pages/allSchoollesson/allSchoollesson?current=${current}&type=3`,
      success: res => {
        res.eventChannel.emit('acceptData', this.data.navList[index])
      }
    })
    // this.setData({
    //   tabCurrent: !this.data.tabCurrent,
    //   'crumbs.tab1': tab1,
    //   'crumbs.tab2': tab2,
    //   lessonList: []
    // }, () => {
    //   this.data.tabCurrent ? wx.setNavigationBarTitle({
    //     title: tab2
    //   }) : wx.setNavigationBarTitle({
    //     title: '全部课程'
    //   })
    //   this.params = {
    //     pageSize: 20, 
    //     pageNum: 1
    //   }
    //   this.pageEnd = 0
    //   if(!categoryId) return
    //   this.categoryLessonOrLive(categoryId)
    // })
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
    if (this.pageEnd) return
    this.params.pageNum += 1
    this.categoryLessonOrLive(this.params.categoryId)
  },
  into(e) {
    wx.navigateTo({
      url: `/page/index/pages/allSchoollesson/allSchoollesson?title=${e.currentTarget.dataset.item.name}&type=4&id=${e.currentTarget.dataset.item.id}`,
    })
  }
})