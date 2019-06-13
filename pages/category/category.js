//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    isRefreshing: false
  },
  onLoad(options) {
    this.setData({
      list: [],
      options: options
    })
    this.param = { category_id: Number(this.data.options.id), page: 1, pageSize: 10 }
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.getList()
    //用于数据统计
    app.aldstat.sendEvent("查看分类", { name: options.name })
  },
  getList(list) {
    let temp = list || this.data.list
    return app.classroom.lessons(this.param).then(msg => {
      if (msg.code === 1) {
        msg.data.forEach(function(item) {
          item.thousand = app.util.tow(item.browse)
        })
        this.setData({
          list: temp.concat(msg.data)
        })
      }
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    this.param.page = 1
    this.setData({
      isRefreshing: true
    })
    this.getList([]).then(() => {
      wx.stopPullDownRefresh()
      let timer = setTimeout(() => {
        this.setData({
          isRefreshing: false
        })
        clearTimeout(timer)
      }, 1000)
    })
  },
  //上拉加载
  onReachBottom() {
    this.param.page++
    this.getList()
  },
  detailTap: function(e) {
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.item.id}&name=${e.currentTarget.dataset.item.title}`
    })
    //用于数据统计
    app.aldstat.sendEvent("课程点击", { name: e.currentTarget.dataset.item.title })
  },
  //用于数据统计
  onHide() {
    app.aldstat.sendEvent("退出", { name: "课程分类列表页" })
  }
})
