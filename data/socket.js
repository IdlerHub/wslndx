/*
 * @Date: 2019-08-08 16:42:54
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-10 16:13:09
 */
function socket() {
  this.connectState = false
  this.reCount = 4
  this.id = -1
  this.beat = null
}

socket.prototype = {
  init: function(id, mark) {
    this.id = id
    this.SocketTask = wx.connectSocket({
      url: "wss://develop.jinlingkeji.cn:8182?c=Bokemessage&uid=" + id,
      header: {
        "content-type": "application/json"
      },
      method: "GET"
    })

    wx.onSocketClose(res => {
      this.connectState = false
      this.beat && clearInterval(this.beat) && (this.beat = null)
      this.reconnection()
    })
    wx.onSocketOpen(res => {
      console.log("连接成功")
      console.log(new Date())
      this.connectState = true
      this.heartBeat()
      this.reCount = 4
    })
    if (mark) {
      this.listen(this.handler)
    }
  },
  listen: function(handler) {
    this.handler = handler
    this.SocketTask.onMessage(res => {
      handler(res)
    })
  },
  send: function(str) {
    if (this.reCount && this.SocketTask.readyState) {
      this.SocketTask.send({
        data: str + "",
        success: res => {
          console.log("success:", res)
        },
        fail: res => {
          console.log("fail:", res)
        }
      })
    } else {
      if (this.reCount == 0) {
        this.reconnection()
      }
      this.SocketTask.onOpen(() => {
        this.SocketTask.send({
          data: str + "",
          success: res => {
            console.log("success:", res)
          },
          fail: res => {
            console.log("fail:", res)
          }
        })
      })
    }
  },
  heartBeat() {
    this.beat = setInterval(() => {
      this.send("")
    }, 50000)
  },
  reconnection: function() {
    if (this.reCount > 0) {
      this.reCount--
      setTimeout(() => this.init(this.id, true), 10000)
    }
  }
}

module.exports = new socket()
