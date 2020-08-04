// page/live/pages/liveSearch/liveSearch.js
const liveData = require("../../data/LiveData");
const app = getApp();
Page({
  data: {
    text: "",
    lastId: 0,
    searchList: [],
    weekList: ['周一','周二','周三','周四','周五','周六','周日']
  },
  onLoad: function (options) {},
  //搜索内容
  toLiveSearch(last_id = 0) {
    let params = {
      keywords: this.data.text,
      page_size: 10,
      last_id,
    };
    liveData.toLiveSearch(params).then((res) => {
      this.setHighLight(res.data);
    });
  },
  setHighLight(lessList) {
    lessList.forEach((item) => {
      // item.title = item.name
      //   .replace(/<highlight>/g, "")
      //   .replace(/<\/highlight>/g, "");
      item.name = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.name
        .replace(/<highlight>/g, '<span style="color:#DF2020">')
        .replace(/<\/highlight>/g, "</span>")}</p>`;
        item.teacher = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.teacher
          .replace(/<highlight>/g, '<span style="color:#DF2020">')
          .replace(/<\/highlight>/g, "</span>")}</p>`;
      // item.subtitle = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.subtitle
      //   .replace(/<highlight>/g, '<span style="color:#DF2020">')
      //   .replace(/<\/highlight>/g, "</span>")}</p>`;
      item.bw = app.util.tow(item.browse);
    });
    lessList.push(...lessList);
    this.setData({
      searchList: lessList,
    });
  },
  changeText(e) {
    this.setData({
      text: e.detail.value,
    });
    e.detail.value.length < 1
      ? this.setData({
          searchList: [],
          lastId: 0,
        })
      : this.toLiveSearch();
  },
  clearText() {
    this.setData({
      text: "",
      searchList: [],
      lastId: 0,
    });
  },
  cancleSearch(){
    this.setData({
      text: "",
      searchList: [],
      lastId: 0,
    });
    wx.navigateBack();
  },
  onShow: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onShareAppMessage: function () {},
});
