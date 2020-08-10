// page/live/pages/liveSearch/liveSearch.js
const liveData = require("../../../../data/LiveData");
const app = getApp();
Page({
  data: {
    showqst: false,
    text: "",
    lastId: 0,
    searchList: [],
    weekList: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  },
  // 去详情页
  toDetail(e) {
    let { lessonId, own } = e.currentTarget.dataset;
    let url = "/page/live/pages/tableDetail/tableDetail?lessonId=" + lessonId;
    if (own) {
      url = "/page/live/pages/liveDetail/liveDetail?lessonId=" + lessonId;
    }
    wx.navigateTo({
      url,
    });
  },
  //搜索内容
  toLiveSearch(last_id = 0) {
    let params = {
      keywords: this.data.text,
      page_size: 10,
      last_id,
    };
    this.data.searchList = [];
      liveData.toLiveSearch(params).then((res) => {
        if(res.data.length == 0){
          this.setData({
            lastId: -1,
            showqst: true,
          })
          return
        }
        this.setHighLight(res.data);
      });
  },
  setHighLight(lessList) {
    let lastId = lessList[lessList.length - 1].id;
    let searchList = this.data.searchList;
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
    searchList.push(...lessList);
    this.setData({
      searchList: searchList,
      showqst: false,
      lastId
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
          showqst: false,
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
  cancleSearch() {
    this.setData({
      text: "",
      searchList: [],
      lastId: 0,
    });
    wx.navigateBack({
      fail: err=>{
        console.log(err)
        wx.redirectTo({
          url: "/page/live/pages/timetable/timetable",
        });
      },
    });
  },
  onReachBottom(){
    if(this.data.lastId == -1) return
    this.toLiveSearch(this.data.lastId);
  },
  onPullDownRefresh: function () {},
  onShareAppMessage: function () {},
});
