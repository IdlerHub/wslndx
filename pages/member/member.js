//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    isRefreshing: false
  },
  pageName: '圈子成员',
  onLoad(options) {
    this.param = { fs_id: options.id, page: 1, pageSize: 10 }
    this.setData({
      detail: {
        user: [],
        friendscircle: []
      }
    })
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.getList([])
  },
  getList(list) {
    let detail = this.data.detail
    let temp = list || this.data.detail.user
    return app.circle.member(this.param).then(msg => {
      if (msg.code == 1) {
        detail = msg.data
        detail.user = temp.concat(msg.data.user || [])
        this.setData({
          detail: detail
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
  //用于数据统计
  onHide() {
  }
})
