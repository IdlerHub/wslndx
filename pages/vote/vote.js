// pages/vote/vote.js
import {
  wxp
} from '../../utils/service.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    classifyList: [{id: '0',name: '全部'}],
    selectedIndex: 0,
    type: 0,  //分类的id
    newProduction: [],
    productionList: [],
    page: 1,
    supportFlag: 1, //今日点赞权限 0=无, 1=有
  },
  toRule() { //跳转到活动规则
    wx.navigateTo({
      url: "/pages/voteRule/voteRule"
    })
  },
  toClassify() {  //分类页
    wx.navigateTo({
      url: "/pages/voteClassify/voteClassify"
    })
  },
  toDetail(e) { //作品详情页
    wx.navigateTo({
      url: "/pages/voteDetail/voteDetail?voteid=" + e.currentTarget.dataset.id
    })
  },
  toSearch(){
    wx.navigateTo({
      url: "/pages/voteSearch/voteSearch"
    })
  },
  giveLike(e) { //点赞
    console.log('我给你点赞',this.data.supportFlag)
    // step1 判断今天是否点赞过
    // step2  作品点赞数添加 （修改data中数据），不刷新页面
    if (this.data.supportFlag==0) {
      //提示
      wx.showToast({
        title: "您今日已经点赞过了哦",
        icon: "none",
        duration: 1500
      })
    } else {
      let index = e.currentTarget.dataset.index
      let work = this.data.productionList[index]
      work.prise_numbers += 1
      let key = 'productionList[' + index + ']'
      this.setData({
        [key]: work,
        supportFlag: 0
      })
      let params = {
        id: e.currentTarget.dataset.id,
        type: work.hoc_id //需要作品带的type
      }
      this.praiseOpus(params)
      console.log('点赞',params)
    }
  },
  changeclassify(e) { //切换分类
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    if (index != this.data.selectedIndex) {
      this.setData({
        selectedIndex: index,
        type: type
      })
      this.getdata(1)
    }
  },
  
  join() {
    wx.navigateTo({
      url: "/pages/voteProduction/voteProduction"
    })
  },
  works() {
    wx.navigateTo({
      url: "/pages/myProduction/myProduction"
    })
  },
  getNewestOpus(){  //获取最新作品
    app.vote.getNewestOpus().then(res => {
      console.log(res)
      this.setData({
        newProduction: res.data
      })
    })
  },
  getdata(page){  // 请求作品列表数据
    var params = {
      type: this.data.type,
      page: page
    }
    let data = []
    app.vote.getOpusList(params).then(res=>{
      console.log(res)
      if(page==1){
        data = res.data.data;
      }else{
        var oldData = this.data.productionList;
        data = oldData.concat(res.data.data)
      }
      this.setData({
        productionList: data,
        page: page,
        supportFlag: res.data.have_praise
      })
    })
    //xhr (selectedIndex , page)
    //  setData ({  selectedIndex , page  })
  },
  getCategory(){  //获取分类数据
    let data = [{ id: '0', name: '全部' }];
    app.vote.getCategory().then(res=>{
      data = data.concat(res.data)
      this.setData({
        classifyList: data
      })
    })
  },
  praiseOpus(params){
    app.vote.praiseOpus(params).then(res=>{
      console.log(res)
      wx.showToast({
        title: "今日点赞成功,请明日再来",
        icon: "none",
        duration: 2500
      })
    }).catch(err=>{
      console.log(err)
    })
  }, 
  changeData(index,type){
    this.setData({
      selectedIndex: index,
      type: type
    })
    this.getdata(1);
  },
  init(){
    return Promise.all([this.getCategory(), this.getdata(1), this.getNewestOpus()])
  },
  onShow(){
    this.init()
  },
  onPullDownRefresh() {
    // this.getCategory();
    // this.getdata(1);
    // this.getNewestOpus();
    this.init().then(()=>{
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom(){
    this.getdata(this.data.page + 1)
  }
})