// components/rankList/rankList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rankList:{  //列表数据
      type: Array,  
      value: []
    },
    topTitle:{  //表头
      type: Array,
      value: []
    },
    setHeight: {  //是否设置内容高度超过一页
      type: String,
      value: 'list'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
