// page/index/pages/chageLesson/chageLesson.js
const app = getApp()
var htmlparser = require("../../../../utils/htmlparser");
Page({
  data: {
    lessonDetail: {},
    current: 0,
    sort: 0
  },
  onLoad: function (ops) {
    this.getLessonDetail(ops.id)
  },
  getLessonDetail(specialColumnId) {
    let _this = this;
    app.liveData.getLiveBySpecialColumnId({
      specialColumnId,
    }).then((res) => {
      wx.setNavigationBarTitle({
        title: res.data.name || "",
      });
      res.data.introduction = htmlparser.default(
        res.data.introduction
      );
      res.data.liverVOS ? res.data.liverVOS.forEach((item, index) => {
        item.index = index + 1
      }) : ''
      _this.setData({
        lessonDetail: res.data
      });
    });
  },
  checktap(e) {
    this.setData({
      current: Number(e.currentTarget.dataset.index)
    })
  },
  bindanimationfinish(e) {
    this.setData({
      current: e.detail.current
    })
  },
  sort() {
    if (this.data.sort) {
      this.data.lessonDetail.liverVOS.sort((a, b) => {
        return a.index - b.index
      })
    } else {
      this.data.lessonDetail.liverVOS.sort((a, b) => {
        return b.index - a.index
      })
    }
    this.setData({
      'lessonDetail.liverVOS': this.data.lessonDetail.liverVOS,
      sort: !this.data.sort
    })
  }
})