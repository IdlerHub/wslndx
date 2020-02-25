// pages/voteSearch/voteSearch.js
Page({

  data: {
    clearhidden: true,
    inputcontent: '',
    productionList: [
      {
        "id": 1,
        "author": '用户昵称',
        "name": "风景风景风景风景风景风景风景风景",
        "prise_numbers": 888,
        "type": 1,
      },
      {
        "id": 2,
        "author": '用户昵称',
        "name": "名胜",
        "prise_numbers": 888,
        "type": 2,
      }
    ],    //作品列表
  },
  changeSearch(e){
    console.log(e)
    if (e.detail.value){  //输入
      this.setData({
        clearhidden: false,
        inputcontent: e.detail.value
      })
    }else{  //删除
      this.setData({
        clearhidden: true,
        inputcontent: ''
      })
    }
  },
  clearInput(){
    console.log(111)
    this.setData({
      clearhidden: true,
      inputcontent: ''
    })
  }
})