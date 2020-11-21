// page/index/pages/allSchoollesson/allSchoollesson.js
const app = getApp()
Page({
  data: {
    currentTab: 0,
    nav: [],
    catrecommend: [],
    currentTab: 0,
    navScrollLeft: 0,
    height: 1000,
    scroll: false
  },
  navHeightList: [],
  onLoad: function (options) {
    let query = wx.createSelectorQuery().in(this), that = this
    query.select(".nav").boundingClientRect()
    query.exec(res => {
      that.navHeight = res[0].height
    })
    Promise.all([this.getCategory()])
  },
  onShow: function () {

  },
  onReachBottom: function () {
    if (!this.data.nav[this.data.currentTab].showBtoom) {
      let id = this.data.nav[this.data.currentTab].id
      let temp = this.data.catrecommend[id]
      this.categoryParams[id].page++
      wx.showLoading({
        title: '加载中'
      })
      app.classroom.lessons(this.categoryParams[id]).then(msg => {
        let next = true
        msg.data.forEach(function (item) {
          item.thousand = app.util.tow(item.browse)
          temp.forEach(i => {
            i.id == item.id ? next = false : ''
          })
        })
        if (!next) return
        if (msg.data.length == 0) {
          this.setData({
            [`nav[${this.data.currentTab}].showBtoom`]: true
          })
        }
        this.data.catrecommend[id] = temp.concat(msg.data)
        this.setData({
          [`catrecommend[${id}]`]: temp.concat(msg.data)
        })
        let query = wx.createSelectorQuery().in(this)
        let that = this,
          nav = this.data.nav,
          currentTab = this.data.currentTab
        query.select(nav[currentTab].class).boundingClientRect()
        query.exec(res => {
          let height = res[0].height
          that.navHeightList[currentTab] = height
          that.setData({
            height: height,
            showLoading: false
          })
          wx.hideLoading()
        })
      })
    }
    this.setData({
      onReachBottom: true
    })
    setTimeout(() => {
      this.setData({
        onReachBottom: false
      })
    }, 1000)
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
      }, () => {
        this.geteCatrcommend(arr[0].id, this.data.currtab, 1)
      })
    })
  },
  geteCatrcommend(id, currtab, type) {
    if (this.data.catrecommend[id]) {
      if (this.data.catrecommend[id][0]) return
    }
    let temp = []
    return app.classroom.lessons(this.categoryParams[id]).then(msg => {
      msg.data.forEach(function (item) {
        item.thousand = app.util.tow(item.browse)
      })
      let catrecommend = this.data.catrecommend
      catrecommend[id] = temp.concat(msg.data)
      this.setData({
        [`catrecommend[${id}]`]: temp.concat(msg.data)
      })
      temp.concat(msg.data).length < 10 ? this.setData({
        [`nav[${this.data.currentTab}].showBtoom`]: true
      }) : ''
      setTimeout(() => {
        currtab != this.data.currentTab && !type ? '' : this.setHeight()
      }, 600)
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
  switchTab(event) {
    let cur = event.detail.current,
      that = this,
      currren = this.data.currentTab
    this.timer ? clearTimeout(this.timer) : ''
    this.timer = setTimeout(() => {
      this.data.currentTab != cur ? cur == that.setData({
        currentTab: cur,
      }) : ''
      wx.hideLoading()
    }, 300)
    if (cur != 0) {
      let id = this.data.nav[cur].id
      this.geteCatrcommend(id, cur)
    }
    setTimeout(() => {
      this.setHeight()
    }, 500)
  },
  setHeight() {
    let nav = this.data.nav
    let currentTab = this.data.currentTab
    if (this.navHeightList[currentTab]) {
      this.navHeightList[currentTab] < 300 ? this.getheight(nav, currentTab) : this.setData({
        height: this.navHeightList[currentTab]
      })
    } else {
      this.getheight(nav, currentTab)
    }
  },
  getheight(nav, currentTab) {
    let query = wx.createSelectorQuery().in(this)
    let that = this
    query.select(nav[currentTab].class).boundingClientRect()
    query.exec(res => {
      console.log(res, nav[currentTab].class)
      let height = res[0].height
      that.navHeightList[currentTab] = height
      that.setData({
        height: height
      })
    })
  },
  onPageScroll(e) {
    if (e.scrollTop >= this.navHeight) {
      !this.data.scroll &&
        this.setData({
          scroll: true
        })
    } else {
      this.data.scroll &&
        this.setData({
          scroll: false
        })
    }
  }
})