// page/index/pages/interested/interested.js
const app = getApp()
Page({
  data: {
    list: [],
    selectNum: 0,
    select: []
  },
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
        select:  this.data.$state.userInfo.recommendCategoryList.split(",")
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
  determine() {
    if (this.data.select.length > 0) {
      let str = this.data.select.toString()
      app.lessonNew.collectLessonCategory({
        categoryStr: str
      }).then(res => {
        app.store.setState({
          'userInfo.recommendCategoryList': str
        })
      })
    } else {
      wx.showToast({
        title: '请至少选择一个您感兴趣的内容',
        icon: 'none'
      })
    }
  }
})