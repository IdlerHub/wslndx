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
}

import store from "../store"

socket.prototype = {
  init: function(id, mark) {
    this.id = id
    console.log()
    this.SocketTask = wx.connectSocket({
      url: "wss://" + store.socket_host + "?c=Bokemessage&uid=" + id,
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
        this.reCount = 3
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
      setTimeout(() => this.init(this.id, true), 3000)
    }
  },
  backstage() {
    if (!this.connectState) {
      this.reCount = 3
      this.reconnection()
    }
  }
}

module.exports = new socket()
