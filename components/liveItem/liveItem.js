// components/liveItem/liveItem.js
Component({
  properties: {
    liveList: {
      type: Array,
      value: []
    },
    isLive: {
      type: Boolean,
      value: 0
    }
  },
  data: {
    
  },
  methods: {
    toLive(e) {
      console.log(e)
      let item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: '/page/live/pages/vliveRoom/vliveRoom?roomId=' + item.liveId,
      })
    }
  }
})
