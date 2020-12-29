// page/index/pages/lessonSpecial/lessonSpecial.js
const app = getApp()
Page({
  data: {
    list: []
  },
  params: {
    pageSize: 10,
    pageNum: 1
  },
  onLoad: function (ops) {
    this.params.subjectId = Number(ops.id)
    this.getList()
  },
  onReachBottom: function () {

  },
  getList() {
    app.liveData.subjectList(this.params).then(res => {
      let arr = this.data.list
      arr.push(...res.dataList)
      this.setData({
        list: arr
      })
    })
  }
})