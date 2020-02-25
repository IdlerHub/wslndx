// pages/vote/vote.js
import { wxp } from '../../utils/service.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyList: ['全部','书法绘画','摄影','演讲','舞蹈','武术','语文','英语','数学'],
    selectedIndex: 1,
    productionList: [
      {
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
  toRule(){ //跳转到活动规则
    console.log(111)
    wx.navigateTo({
      url: "/pages/voteRule/voteRule"
    })
  },
  toDetail(){ //作品详情页
    wx.navigateTo({
      url: "/pages/voteDetail/voteDetail"
    })
  },
  giveLike(){ //点赞
    console.log("我给你点赞")
  },
  changeclassify(e){  //切换分类
    this.setData({
      selectedIndex: e.currentTarget.dataset.index
    })
  }
})