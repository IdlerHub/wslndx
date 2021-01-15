// page/post/pages/search/search.js
import api from "../../api/index"
Page({
  data: {
    text: '',
    current: 0,
    height: 'calc(100vh - 130px)',
    searchWordlist: [],
    cList: [],
    uList: [],
    showHistory: 1
  },
  pageName: "秀风采搜索",
  cPage: 1,
  uPage: 1,
  onLoad: function (options) {
    this.getSearchword(1)
    wx.uma.trackEvent("post_btnClick", {
      btnName: "搜索按钮"
    });
  },
  onShow: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    let params = {}, current = this.data.current
    if(current) {
      params = {
        type: 2,
        word: this.data.text,
        page: this.uPage += 1,
        uid: this.data.$state.userInfo.id
      }
    } else {
      params = {
        type: 1,
        word: this.data.text,
        page: this.cPage += 1,
        uid: this.data.$state.userInfo.id
      }
    }
    this.searchMore(params, current ? this.data.uList : this.data.cList).then(() => {
      this.setHeight()
    })
  },
  swiperChange(e) {
    this.setData({
      current: e.detail.current
    },() => {
      this.setHeight()
    })
  },
  getSearchword(type) {
    api.searchWord({
      type,
      uid: this.data.$state.userInfo.id
    }).then(res => {
      this.setData({
        searchWordlist: res.data,
        showHistory: 1
      })
    })
  },
  delSearchword() {
    this.getSearchword(2)
  },
  checkTab(e) {
    this.setData({
      current: e.currentTarget.dataset.index
    },() => {
      this.setHeight()
    })
  },
  txtchange(e) {
    this.setData({
      text: e.detail.value
    })
  },
  cleartxt() {
    this.setData({
      text: "",
      current: 0
    }, () => {
      this.getSearchword(1)
    });
  },
  touchItem(e) {
    let item = e.currentTarget.dataset.item
    this.setData({
      text: item.word
    }, () => {
      this.searchlesss()
    })
  },
  searchlesss() {
    this.cPage = 1
    this.uPage = 1
    let cParam = {
        type: 1,
        word: this.data.text,
        page: this.cPage,
        uid: this.data.$state.userInfo.id
      },
      uParam = {
        type: 2,
        word: this.data.text,
        page: this.uPage,
        uid: this.data.$state.userInfo.id
      }
    Promise.all([this.searchMore(cParam), this.searchMore(uParam)]).then(() => {
      setTimeout(() => {
        this.setData({
          showHistory: 0
        })
        this.setHeight()
      }, 500)
    })
  },
  searchMore(param, list) {
    return api.search(param).then(res => {
      if (param.type == 1) {
        this.setData({
          cList: list ? list.concat(res.data.list) : res.data.list
        })
      } else {
        this.setData({
          uList: list ? list.concat(res.data.list) : res.data.list
        })
      }
    })
  },
  setHeight() {
    let that = this
    let query = wx.createSelectorQuery().in(this);
    query.selectAll('#searchBox').boundingClientRect();
    query.exec(res => {
      that.setData({
        height: res[0][this.data.current].height + 50 + 'px'
      });
    });
  },
  touchListitem(e) {
    let item = e.currentTarget.dataset.item
    if(this.data.current) {
      wx.navigateTo({
        url: `/page/post/pages/personPage/personPage?uid=${item.id}&nickname=${item.nickname}&university_name=${item.university_name}&avatar=${item.avatar}&addressCity=${item.province}&follow=${item.is_follow}`
      });
    } else {
      wx.navigateTo({
        url: `/pages/cDetail/cDetail?id=${item.id}`
      });
    }
  },
  touchBtn(e) {
    let item = e.currentTarget.dataset.item, type = e.currentTarget.dataset.type
    if(type) {
      item.is_follow ? "" : api.addOne({fs_id: item.id}).then(() => {
        this.data.cList.forEach((v,i) =>{
          v.id == item.id ? this.setData({
            [`cList[${i}].is_follow`]: 1
          }) : ''
        })
      })
    } else {
      item.is_follow ? "" : api.following({follower_uid: item.id}).then(() => {
        this.data.uList.forEach((v,i) =>{
          v.id == item.id ? this.setData({
            [`uList[${i}].is_follow`]: 1
          }) : ''
        })
      })
    }
  }
})