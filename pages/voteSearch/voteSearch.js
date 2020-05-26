// pages/voteSearch/voteSearch.js
const app = getApp();
Page({
  data: {
    clearhidden: true,
    inputcontent: "", //输入框的内容
    searchWord: "", //搜索关键词
    productionList: [], //作品列表
    page: 1,
    total_page: 1,
    history: []
  },
  pageName: '赛事活动搜索页',
  goBack() {
    wx.navigateBack(); //返回
  },
  toDetail(e) {
    wx.navigateTo({
      url: "/pages/voteDetail/voteDetail?voteid=" + e.currentTarget.dataset.id
    });
  },
  clickSearch(e) {
    //选中历史记录搜索
      this.setData({
        searchWord: e.currentTarget.dataset.word,
        inputcontent: e.currentTarget.dataset.word,
        clearhidden: false
      });
      this.searchOpus(1);
  },
  toSearch(e) {
    //输入结束后的关键词
    this.setData({
      searchWord: e.detail.value,
      inputcontent: e.detail.value
    });
    this.searchOpus(1);
  },
  changeSearch(e) {
    //输入时
    if (e.detail.value) {
      //输入框还有内容
      this.setData({
        clearhidden: false
      });
    } else {
      //输入框清空
      this.clearInput();
    }
  },
  delhistory(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.searchid;
    let item = this.data.history;
    item.splice(index, 1);
    this.setData({
      history: item
    });
    this.delSearchWord(id);
  },
  clearInput() {
    this.setData({
      clearhidden: true,
      inputcontent: "",
      searchWord: "",
      history: []
    });
    this.getSearchWord(); //获取搜索历史
  },
  delSearchWord(id) {
    let params = { id: id };
    app.vote.delSearchWord(params);
  },
  getSearchWord() {
    //搜索记录
    app.vote.getSearchWord().then(res => {
      this.setData({
        history: res.data
      });
    });
  },
  searchOpus(page) {
    //搜索结果
    let params = {
      word: this.data.searchWord,
      page: page
    };
    let data = [];
    let total_page = 1;
    app.vote.searchOpus(params).then(res => {
      if (page == 1) {
        data = res.data.data;
      } else {
        var oldData = this.data.productionList;
        data = oldData.concat(res.data.data);
      }
      total_page = res.data.total_page;
      this.setData({
        productionList: data,
        page: page,
        total_page: total_page
      });
    });
  },
  onLoad() {
    this.getSearchWord(); //搜索历史
    // this.searchOpus(1);
  },
  onReachBottom() {
    let page = this.data.page;
    if(page < this.data.total_page){
      this.searchOpus(page + 1);
    }else{
      wx.showToast({
        icon: "none",
        title: "已经没有数据了哦",
        duration: 1000
      });
    }
  }
});
