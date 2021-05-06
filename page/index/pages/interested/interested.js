const Tutor = require("../../../../data/Tutor")

// page/index/pages/interested/interested.js
const app = getApp()
Page({
  data: {
    list: [],
    selectNum: 0,
    select: [],
    lesson: [],
    popupShow: false
  },
  param: {
    type: 1,
    pageSize: 10,
    pageNum: 1
  },
  pageName: 'interested',
  onLoad: function (options) {
    this.getAllCategory()
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onShareAppMessage: function () {

  },
  getAllCategory() {
    app.lessonNew.getAllCategory().then(res => {
      let num = 0
      res.dataList.forEach((e, i) => {
        e.index = i
        e.categoryList.forEach(t => {
          this.data.$state.userInfo.recommendCategoryList.indexOf(t.id) >= 0 ? [t.select = 1, num += 1] : t.select = 0
        })
      })
      this.setData({
        list: res.dataList,
        selectNum: num,
        select: this.data.$state.userInfo.recommendCategoryList.split(",")
      })
    })
  },
  select(e) {
    let index = e.currentTarget.dataset.index,
      idx = e.currentTarget.dataset.idx
    if (this.data.list[index].categoryList[idx].select) {
      let i = this.data.select.indexOf(String(this.data.list[index].categoryList[idx].id))
      console.log(i)
      this.data.select.splice(i, 1)
      this.setData({
        [`list[${index}].categoryList[${idx}].select`]: 0,
        selectNum: this.data.selectNum - 1,
        select: this.data.select
      })
    } else {
      this.data.select.push(this.data.list[index].categoryList[idx].id)
      this.setData({
        [`list[${index}].categoryList[${idx}].select`]: 1,
        selectNum: this.data.selectNum += 1,
        select: this.data.select
      })
    }
  },
  determine: async function () {
    if (this.data.select.length > 0) {
      let str = this.data.select.toString(),page = getCurrentPages()
      this.param.selectCategoryId = str.split(',')
      await app.lessonNew.collectLessonCategory({
        categoryStr: str
      })
      app.store.setState({
        'userInfo.recommendCategoryList': str
      })
      wx.setStorageSync("userInfo", this.data.$state.userInfo);
      page[0].freeParams.pageNum = 1
      page[0].schoolParams.pageNum = 1
      page[0].scroll = 1
      page[0].getRecommendLessons()
      wx.navigateTo({
        url: '/page/index/pages/recommendList/recommendList?str=' + str.split(','),
      })
      // await this.getLesson()
      // this.bindLeft()
      // .then(res => {
      // app.store.setState({
      //   'userInfo.recommendCategoryList': str
      // })
      // wx.setStorageSync("userInfo", this.data.$state.userInfo);
      // wx.showToast({
      //   title: '选择成功',
      //   icon: 'none'
      // })
      // getCurrentPages().forEach(e => {
      //   e.route == 'pages/index/index' ? e.getinterestList() : ''
      // })
      // wx.navigateBack()
      // })
    } else {
      wx.showToast({
        title: '请至少选择一个您感兴趣的内容',
        icon: 'none'
      })
    }
  },
  getLesson(list) {
    let arr = list || this.data.lesson
    return app.liveData.selectRecommedListByCategoryIds(this.param).then(res => {
      this.setData({
        lesson: arr.concat(res.dataList)
      })
    })
  },
  bindLeft() {
    this.setData({
      popupShow: !this.data.popupShow
    }, () => {
      if (this.data.popupShow) return
      this.setData({
        lesson: []
      })
      this.param.pageNum = 1
    })
  },
})