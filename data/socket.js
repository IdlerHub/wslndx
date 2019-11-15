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
  this.handler = {
    Bokemessage: 'bokemessage',
    Prizemessage: 'prizemessage'
  }
}

import store from "../store"
import md5 from "../utils/md5.js"
socket.prototype = {
  init: function(id, mark) {
    this.id = id
    let token = wx.getStorageSync("token")
    this.timestamp = parseInt(new Date().getTime() / 1000 + "")
    this.sign = md5("uid=" + id + "&token=" + token + "&timestamp=" + this.timestamp)
    //?c=Bokemessage
    this.SocketTask = wx.connectSocket({
      url: "wss://" + store.socket_host + "?&uid=" + id + "&timestamp=" + this.timestamp + "&sign=" + this.sign,
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
      setTimeout(() => {
        this.send({
          type: 'Prizemessage',
          data: {
            uid: id
          }
        })
        this.send({
          type: 'Bokemessage',
          data: {
            uid: id
          }
        })
      }, 2000)
    })
    if (mark) {
      this.listen(this.handler['Bokemessage'])
    }
  },
  listen: function(handler, conut) {
    conut ? this.handler[conut] = handler : ''
    this.SocketTask.onMessage(res => {
      let data = JSON.parse(res.data)
      if (data) {
        this.handler[data.type](res)
      }
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
          data: JSON.stringify(param),
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
      this.send({
        type: '',
        data: {}
      })
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