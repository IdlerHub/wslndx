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
    productionList: [{
        "id": 13,
        "name": "测试作品9",
        "type": 1,
        "url": [
          "https://jxglcdnbj4.jinlingkeji.cn/uploads/images/201911/20/1b90fa4fd118477f89fddfe02aaab4a7.jpg"
        ],
        "prise_numbers": 999
      },
      {
        "id": 13,
        "name": "测试作品10",
        "type": 2,
        "url": [
          "https://jxglcdnbj4.jinlingkeji.cn/uploads/images/201911/20/1b90fa4fd118477f89fddfe02aaab4a7.jpg"
        ],
        "prise_numbers": 0
      },
      {
        "id": 13,
        "name": "测试作品9",
        "type": 2,
        "url": [
          "https://jxglcdnbj4.jinlingkeji.cn/uploads/images/201911/20/1b90fa4fd118477f89fddfe02aaab4a7.jpg"
        ],
        "prise_numbers": 999
      },
    ],
    page: 1,
  },
  toRule() { //跳转到活动规则
    wx.navigateTo({
      url: "/pages/voteRule/voteRule"
    })
  },
  toDetail() { //作品详情页
    wx.navigateTo({
      url: "/pages/voteDetail/voteDetail"
    })
  },
  giveLike(e) { //点赞
    console.log("我给你点赞")
    // step1 判断今天是否点赞过
    // step2  作品点赞数添加 （修改data中数据），不刷新页面
    if ('') {
      //提示
      wx.showToast({
        title: "您今日已经点赞过了哦",
        icon: "none",
        duration: 2500
      })
    } else {
      let index = e.currentTarget.dataset.index
      let work = this.data.productionList[index]
      work.prise_numbers += 1
      let key = 'productionList[' + index + ']'
      this.setData({
        [key]: work
      })
      let params = {
        id: e.currentTarget.dataset.id,
        type: this.data.selectedIndex
      }
      console.log('点赞',params)
    }
  },
  changeclassify(e) { //切换分类
    let index = e.currentTarget.dataset.index
    if (index != this.data.selectedIndex) {
      this.setData({
        selectedIndex: index
      })
      this.getdata(1)
    }
  },
  toClassify() {
    wx.navigateTo({
      url: "/pages/voteClassify/voteClassify"
    })
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
  getdata(page){  // 请求作品列表数据
    var params = {
      type: this.data.selectedIndex,
      page: page
    }
    console.log(params)
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
        page: page
      })
    })
    //xhr (selectedIndex , page)
    //  setData ({  selectedIndex , page  })
  },
  getCategory(){  //获取分类数据
    var data = this.data.classifyList;
    app.vote.getCategory().then(res=>{
      this.setData({
        classifyList: data.concat(res.data)
      })
    })
  },
  onLoad(){
    this.getCategory()
    this.getdata(1)
  },
  onReachBottom(){
    this.getdata(this.data.page + 1)
  }
})