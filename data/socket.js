/*
 * @Date: 2019-08-08 16:42:54
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-13 14:16:05
 */
function socket() {
  this.connectState = false
  this.reCount = 3
  this.id = -1
  this.beat = null
  this.handler = []
}

import store from "../store"

socket.prototype = {
  init: function(id, mark) {
    this.id = id
    console.log()
    //?c=Bokemessage
    this.SocketTask = wx.connectSocket({
      url: "wss://" + store.socket_host + "?&uid=" + id + "&timestamp=" + store.$state.timestamp + "&sign=" + store.$state.signer,
      header: {
        "content-type": "application/json"
      },
      method: "GET"
    })

    wx.onSocketClose(res => {
      console.log("连接断开")
      this.connectState = false
      this.beat && clearInterval(this.beat) && (this.beat = null)
      this.reconnection()
    })
    wx.onSocketOpen(res => {
      console.log("连接成功")
      this.connectState = true
      this.heartBeat()
      this.reCount = 3
      setTimeout( () => {
        this.send({
          type: 'Prizemessage',
          data: `{uid：${id}}`
        })
      }, 2000)
    })
    if (mark) {
      this.listen(this.handler)
    }
  },
  listen: function(handler) {
    this.handler = handler
    // if (!this.handler[0]) {
    //   this.handler.push(handler)
    // } else {
    //   this.handler.forEach(item => {
    //     item == handler ? '' : this.handler.push(handler)
    //   })
    // }
    this.SocketTask.onMessage(res => {
      console.log(res)
      handler(res)
    })
  },
  send: function(param) {
    if (this.reCount && this.SocketTask.readyState) {
      this.SocketTask.send({
        data: JSON.stringify(param),
        success: res => {
          console.log("success:", res)
        },
        fail: res => {
          console.log("fail:", res)
        }
      })
    } else {
      if (this.reCount == 0) {
        this.reCount = 3
        this.reconnection()
      }
      this.SocketTask.onOpen(() => {
        this.SocketTask.send({
          data: param,
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
        setTimeout(() => this.init(this.id, true), 3000)
    }
  },
  backstage() {
    if (!this.connectState) {
      this.reCount = 3
      this.reconnection()
    }
  },
  close() {
    if (this.SocketTask) {
      this.SocketTask.close({
        success: () => {
          console.log('socket关闭成功')
          this.SocketTask = ''
        },
        fail: () => {
          console.log('socket关闭失败')
        }
      })
    }

  }
}

module.exports = new socket()