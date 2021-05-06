// page/discoveryHall/pages/works/works.js
const app = getApp()
Page({
  data: {
    list: []
  },
  params: {
    pageSize: 0,
    pageNum: 1
  },
  onLoad: function (options) {
    this.params.pageSize = options.taskNum
    this.getList()
  },
  onShow: function () {
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
    if(this.params.pageSize < 10) return
    this.params.pageNum += 1
    this.getList(this.data.list)
  },
  checknextTap(e) {
    app.checknextTap(e);
  },
})