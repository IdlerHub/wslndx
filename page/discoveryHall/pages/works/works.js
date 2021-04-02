// page/discoveryHall/pages/works/works.js
const app = getApp()
Page({
  data: {
    list: []
  },
  params: {
    pageSize: 10,
    pageNum: 1
  },
  onLoad: function (options) {

  },
  onShow: function () {
    this.getList()
  },
  getList(list) {
    let arr = list || []
    app.activity.hallGetOpus(this.params).then(res => {
      arr.push(...res.dataList)
      this.setData({
        list: arr
      })
    })
  },
  onReachBottom: function () {

  },
})