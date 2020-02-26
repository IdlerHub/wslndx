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
    classifyList: ['全部', '书法绘画', '摄影', '演讲', '舞蹈', '武术', '语文', '英语', '数学'],
    selectedIndex: 1,
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
    page: 1
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
    if ('点赞过') {
      //提示
    } else {
      let index = e.currentTarget.dataset.index
      let work = this.data.productionList[index]
      work.prise_numbers += 1
      let key = 'productionList[' + index + ']'
      this.setData({
        [key]: work
      })
    }
  },
  changeclassify(e) { //切换分类
    let index = e.currentTarget.dataset.index
    if (index != this.data.selectedIndex) {
      this.setData({
        selectedIndex: index
      })
      this.getdata(0)
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
  getdata(page){  // 请求数据
     //xhr (selectedIndex , page)
     //  setData ({  selectedIndex , page  })
  },
  onLoad(){
      this.getdata(0)
  },
  onReachBottom(){
    this.getdata(this.data.page + 1)
  }
})