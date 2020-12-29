// page/index/pages/lessonSpecial/lessonSpecial.js
const app = getApp()
Page({
  data: {
    list: [],
    classfyList: []
  },
  params: {
    pageSize: 10,
    pageNum: 1
  },
  onLoad: function (ops) {
    wx.setNavigationBarTitle({
      title: ops.name
    })
    this.params.subjectId = Number(ops.id)
    this.getList()
  },
  onReachBottom: function () {
    this.params.pageNum += 1
    this.getList()
  },
  getList() {
    app.liveData.subjectList(this.params).then(res => {
      let arr = this.data.list
      arr.push(...res.dataList)
      this.setData({
        list: arr
      },() => {
        this.listClassify(this.data.list)
      })
    })
  },
  listClassify(arr) {
    let newArr = [];
    arr.forEach((item, i) => {
      let index = -1;
      let alreadyExists = newArr.some((newItem, j) => {
        if (item.subjectCategoryName == newItem.subjectCategoryName) {
          index = j;
          return true;
        }
      });
      if (!alreadyExists) {
        newArr.push({
          subjectCategoryName: item.subjectCategoryName,
          list: [item]
        });
      } else {
        newArr[index].list.push(item);
      }
    });
    newArr.sort(function compareFunction(a,b){
      return a.subjectCategoryName.localeCompare(b.subjectCategoryName);
  });
    this.setData({
      classfyList: newArr
    })
  },
})