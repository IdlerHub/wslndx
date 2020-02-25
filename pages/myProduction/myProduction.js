// pages/myProduction/myProduction.js
Page({
  data: {
    state: ['已通过','待审核','未通过'],
    stateIndex: 0,
    stateNum: [1,2,3],
    productionList: [
      {
        "id": 1,
        "name": "风景风景风景风景风景风景风景风景",
        "prise_numbers": 888,
        "type": 1,
        "createtime": "2020-02-24 14:05:51"
      },
      {
        "id": 2,
        "name": "名胜",
        "prise_numbers": 888,
        "type": 2,
        "createtime": "2020-02-24 14:05:51"
      }
    ],    //作品列表

  },
  changeState(e){
    console.log(e)
    this.setData({
      stateIndex: e.currentTarget.dataset.index
    })
  },
  
})