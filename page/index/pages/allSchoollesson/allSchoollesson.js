// page/index/pages/allSchoollesson/allSchoollesson.js
const app = getApp()
Page({
  data: {
    currentTab: 0,
    nav: [],
    currentTab: 0,
    navScrollLeft: 0
  },
  onLoad: function (options) {
    Promise.all([this.getCategory()])
  },
  onShow: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  getCategory() {
    this.setData({
      currentTab: 0,
    })
    this.categoryParams = {}
    return app.user.getLessonCategory().then(msg => {
      let arr = this.data.nav.slice(0, 1)
      msg.data.user_lesson_category.forEach((i, index) => {
        this.categoryParams[i.id] = {
          category_id: i.id,
          page: 1,
          pageSize: 10
        }
        i['class'] = '#recommend' + i.id
        i['showBtoom'] = false
        arr.push(i)
      })
      this.setData({
        nav: arr
      })
    })
  },
  switchNav(event) {
    let cur = event.currentTarget.dataset.current,
      id = event.currentTarget.dataset.id
    if (this.data.currentTab != cur) {
      this.setData({
        currentTab: cur
      })
    }
    if (this.data.currentTab == 0) {
      this.setData({
        navScrollLeft: 0
      })
    }
  },
})