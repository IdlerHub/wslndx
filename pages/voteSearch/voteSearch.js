// pages/voteSearch/voteSearch.js
const app = getApp();
Page({
  data: {
    clearhidden: true,
    inputcontent: '',       //输入框的内容
    searchWord: '',   //搜索关键词
    productionList: [],    //作品列表
    page: 1,
    history: []
  },
  goBack(){
    wx.navigateBack();  //返回
  },
  toDetail(e){
    wx.navigateTo({
      url: "/pages/voteDetail/voteDetail?id=" + e.currentTarget.dataset.id
    })
  },
  clickSearch(e){ //选中历史记录搜索
    this.setData({
      searchWord: e.currentTarget.dataset.word
    })
    this.searchOpus(1);
  },
  toSearch(e){  //输入结束
    console.log('最终关键词',e);
    this.setData({
      searchWord: e.detail.value
    })
    this.searchOpus(1);
  },
  changeSearch(e){  //输入时
    console.log(e)
    if (e.detail.value){  //输入框还有内容
      this.setData({
        clearhidden: false,
        inputcontent: e.detail.value,
        searchWord: ''
      })
      this.getSearchWord(); //获取搜索历史
    }else{  //输入框清空
      this.clearInput()
    }
  },
  delhistory(){ 
    console.log("删除当前历史记录")
  },
  clearInput(){
    this.setData({
      clearhidden: true,
      inputcontent: '',
      searchWord: '',
      history: []
    })
  },
  getSearchWord(){  //搜索记录
    app.vote.getSearchWord().then(res=>{
      console.log(res)
      this.setData({
        history: res.data
      })
    })
  },
  searchOpus(page){ //搜索结果
    let params ={
      word: this.data.searchWord,
      page: page
    }
    let data =[]
    app.vote.searchOpus(params).then(res=>{
      if (page == 1) {
        data = res.data.data;
      } else {
        var oldData = this.data.productionList;
        data = oldData.concat(res.data.data)
      }
      this.setData({
        productionList: data,
        page: page,
      })
      console.log(res)
    })
  },
  onLoad(){
    this.searchOpus(1);
  },
  onReachBottom() {
    this.searchOpus(this.data.page + 1)
  }
})