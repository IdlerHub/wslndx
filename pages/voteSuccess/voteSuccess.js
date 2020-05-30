/*
 * @Github: https://github.com/IdlerHub
 * @Author: zxk
 * @Date: 2020-05-13 12:42:53
 * @LastEditors: zxk
 * @LastEditTime: 2020-05-26 18:02:59
 */ 
// pages/voteSuccess/voteSuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  pageName: '上传成功展示页',
  toMyproduction(){
    wx.redirectTo({
      url: '/pages/myProduction/myProduction'
    })
  }
})