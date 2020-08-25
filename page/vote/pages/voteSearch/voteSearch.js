const app = getApp();
Page({
  data: {
    clearhidden: true,
    inputcontent: "", //输入框的内容
    searchWord: "", //搜索关键词
    productionList: [], //作品列表
    scroll_id: '',  //获取分页搜索列表
    history: [],
  },
  pageName: "赛事活动搜索页",
  goBack() {
    wx.navigateBack(); //返回
  },
  toDetail(e) {
    wx.navigateTo({
      url:
        "/page/vote/pages/voteArticle/voteArticle?voteid=" +
        e.currentTarget.dataset.id,
    });
  },
  clickSearch(e) {
    //选中历史记录搜索
    this.setData({
      searchWord: e.currentTarget.dataset.word,
      inputcontent: e.currentTarget.dataset.word,
      clearhidden: false,
      productionList: [],
    });
    this.searchOpus();
  },
  toSearch(e) {
    //输入结束后的关键词
    this.setData({
      searchWord: e.detail.value,
      inputcontent: e.detail.value,
      productionList: [],
    });
    this.searchOpus();
  },
  changeSearch(e) {
    //输入时
    if (e.detail.value) {
      //输入框还有内容
      this.setData({
        clearhidden: false,
        // searchWord: e.detail.value,
        // inputcontent: e.detail.value,
        // productionList: [],
      });
      // this.searchOpus();
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
      history: item,
    });
    this.delSearchWord(id);
  },
  clearInput() {
    this.setData({
      productionList: [],
      clearhidden: true,
      inputcontent: "",
      searchWord: "",
    });
    this.getSearchWord(); //获取搜索历史
  },
  delSearchWord(id) {
    let params = { id: id };
    app.vote.delSearchWord(params);
  },
  getSearchWord() {
    //搜索记录
    app.vote.getSearchWord().then((res) => {
      this.setData({
        history: res.data,
      });
    });
  },
  searchOpus(scroll_id = '') {
    //搜索结果
    if (this.data.searchWord != '' && this.data.searchWord.trim() == "") {
      wx.showToast({
        title: "请输入搜索关键字",
        icon: "none",
        duration: 1000,
      });
      return;
    }
    let params = {
      word: this.data.searchWord,
      scroll_id,
    };
    let data = this.data.productionList;
    app.vote.searchOpus(params).then((res) => {
      if (scroll_id != '' && res.data.data.length == 0) {
        wx.showToast({
          icon: "none",
          title: "已经没有数据了哦",
          duration: 1000,
        });
        return;
      }
      data = data.concat(res.data.data);
      scroll_id = res.data.scroll_id;
      this.setData({
        productionList: data,
        scroll_id
      });
    });
  },
  onLoad() {
    this.getSearchWord(); //搜索历史
    // this.searchOpus(1);
  },
  onReachBottom() {
    this.searchOpus(this.data.scroll_id);
  },
});
