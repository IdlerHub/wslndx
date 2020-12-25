// page/index/pages/chageLesson/chageLesson.js
const app = getApp()
var htmlparser = require("../../../../utils/htmlparser");
Page({
  data: {
    lessonDetail: {},
    current: 0
  },
  onLoad: function (ops) {
    this.getLessonDetail(ops.id)
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onUnload: function () {

  },
  getLessonDetail(specialColumnId) {
    let _this = this;
    app.liveData.getLiveBySpecialColumnId({
      specialColumnId,
    }).then((res) => {
      wx.setNavigationBarTitle({
        title: res.data.name || "",
      });
      if (res.data.isAddSubscribe == 0 && !(res.data.price > 0)) {
        wx.redirectTo({
          url: `/page/live/pages/tableDetail/tableDetail?specialColumnId=${specialColumnId}`,
        });
      }
      res.data.introduction = htmlparser.default(
        res.data.introduction
      );
      _this.setData({
        lessonDetail: res.data
      });
    });
  },
})