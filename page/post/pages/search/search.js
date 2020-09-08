// page/post/pages/search/search.js
import api from "../../api/index"
Page({
  data: {
    text: '',
    current:0,
    height: 'calc(100vh - 130px)',
    searchWordlist: []
  },
  onLoad: function (options) {
    this.getSearchword()
  },
  onShow: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  getSearchword() {
    api.searchWord({type: 1}).then(res => {
      this.setData({
        searchWordlist: res.data
      })
    })
  },
  checkTab(e) {
    this.setData({
      current: e.currentTarget.dataset.index
    })
  },
  txtchange(e) {
    this.setData({
      text: e.detail.value
    })
  },
  cleartxt() {
    this.setData({
      text: ""
    });
  },
})