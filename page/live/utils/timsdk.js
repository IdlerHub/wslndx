import TIM from 'tim-wx-sdk'

var then = null
var nextReqMessageID = ''
var app = getApp()
var customText = {
  /** 小助手进入房间*/
  MD5_HELPER_ENTER_LIVE: "3ba15067d362f56fbfd21406b0218ce1",
  /** 主播开始直播*/
  MD5_ANCHOR_START_LIVE: "9700e115d29edd06b160b6ccddac4418",
  /** 主播重新进入房间*/
  MD5_ANCHOR_RESTART_LIVE: "ee07a26161938852c3bc78d8aa02479b",
  /** 主播结束直播*/
  MD5_ANCHOR_FINISH_LIVE: "79a5325920cb27c97654e65da37f5408",
  /** 主播暂时离开*/
  MD5_ANCHOR_LEAVE_LIVE: "01ff35f1f878fe1ef0a1501707664b32",
  /** 观众进入直播*/
  MD5_AUDIENCE_ENTER_LIVE: "0008043cc6f0647e061acf18dac98ef3",
  /** 观众离开直播*/
  MD5_AUDIENCE_LEAVE_LIVE: "5392aa930b707969f4d363cd196947a9",
  /** 后台结束直播解散房间*/
  MD5_BACKSTAGE_FINISH_LIVE: "5ef8580c35a92ce22aaad6154b186948",
  /** 观众申请 **/
  MD5_LINKMIC_AUDIENCE_APPLY: "284233f17394a683f39f835ef0bad98b",
  /** 观众拒绝 **/
  MD5_LINKMIC_AUDIENCE_REFUSE: "7f5b59116e367f7ce23c32e414230707",
  /** 观众断开 **/
  MD5_LINKMIC_AUDIENCE_DISCONNECT: "2bf1cc66521677f099916283cb43c459",
  /** 主播同意 **/
  MD5_LINKMIC_ANCHOR_AGREE: "d9fa71b2ff1d238aafa9c02710b6233f",
  /** 主播连接成功 **/
  MD5_LINKMIC_ANCHOR_SUCCESS: "4c87b45c4ea258907bfd161db7e5893a",
  /** 观众分享直播间 **/
  MD5_AUDIENCE_SHARE_LIVE_ROOM: "b6b7bc2d01bcb555795e9ed7ca5f84f5",
  /** 观众关注直播间主播 **/
  MD5_AUDIENCE_FOLLOW_LIVE_ROOM_ANCHOR: "b13ace4737652a74ef2ff02349eab853",
  /** 观众点赞直播间主播 **/
  MD5_AUDIENCE_PRAISE_ANCHOR: "751e68f208e65780d52c1a0d53c6c8d4",
}



let messageUplisten = function (event) {
  // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
  // event.name - TIM.EVENT.MESSAGE_RECEIVED
  // event.data - 存储 Message 对象的数组 - [Message]
  event.data.forEach(e => {
    let {
      nick,
      payload,
      to
    } = e
    console.log(to, then.data.liveDetail.chatGroup)
    if (to != then.data.liveDetail.chatGroup) return
    // && messageFilter(payload, 1) != 1 && messageFilter(payload, 1) != 4
    console.log(messageFilter(payload, 1))
    if (messageFilter(payload, 1) > 0 && messageFilter(payload, 1) != 1 && messageFilter(payload, 1) != 4) {
      const talkList = then.data.talkList
      console.log('新增消息列表消息')
      talkList.push({
        nick,
        payload: payload.text ? payload : JSON.parse(payload.data)
      })
      payload.text ? '' : messageFilter(payload) == -1 ? then.addliveCount() : ''
      then.setData({
        talkList
      })
    } else if (messageFilter(payload, 1) == 1 || messageFilter(payload, 1) == 4) {
      console.log('点赞消息/进入直播间')
      const specialList = then.data.specialList
      specialList.push({
        nick: nick,
        payload: JSON.parse(payload.data),
      })
      messageFilter(payload, 1) == 1 ? then.setData({
        liveCount: then.data.liveCount + 1
      }) : ''
      then.setData({
        specialList
      })
    } else if (messageFilter(payload) == -4) {
      then.setData({
        liveStatus: 4
      })
    } else if (messageFilter(payload) == -2) {
      then.setData({
        liveStatus: 1
      })
    } else if (messageFilter(payload) == -3) {
      then.setData({
        liveStatus: 3
      })
    }
  })
}

//tim初始化
function timInit(that, values, type) {
  then = that
  let options = {
    SDKAppID: then.data.$state.sdkAppid
  };
  then.tim = TIM.create(options);
  if (type) return
  then.tim.setLogLevel(1);
  then.tim.on(TIM.EVENT.SDK_READY, (event) => {
    // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
    joinGroup()
    messageUp()
  });
  timLogin({
    uid: values.uid,
    userSig: values.userSig
  })
}

//tim登录
function timLogin(params) {
  then.tim.login({
    userID: String(params.uid),
    userSig: params.userSig
  }).then((imResponse) => {
    console.log(imResponse.data, '登录成功');
    if (imResponse.data.repeatLogin === true) {
      console.log(imResponse.data.errorInfo, '重复登录');
    }
  }).catch(function (imError) {
    console.warn('登录失败', imError); // 登录失败的相关信息
  });
}

//tim等出
function timLoginout() {
  then.tim.logout().then(function (imResponse) {
    console.log(imResponse.data, '登出成功'); // 
  }).catch(function (imError) {
    console.warn('登出失败', imError);
  });
}

//加入群组
function joinGroup() {
  then.tim.joinGroup({
    groupID: String(then.data.liveDetail.chatGroup),
    type: TIM.TYPES.GRP_MEETING
  }).then((imResponse) => {
    switch (imResponse.data.status) {
      case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL:
        break;
      case TIM.TYPES.JOIN_STATUS_SUCCESS:
        console.log(imResponse.data.group, '加群成功');
        break;
      case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP:
        console.log("已入群")
        break;
      default:
        break;
    }
    then.tim.updateMyProfile({
      nick: then.data.userInfo.nickname,
      avatar: then.data.userInfo.avatar,
      gender: TIM.TYPES.GENDER_MALE,
      selfSignature: '',
      allowType: TIM.TYPES.ALLOW_TYPE_ALLOW_ANY
    }).then(function (imResponse) {
      console.log(imResponse.data, '更新资料成功'); // 更新资料成功
    }).catch(function (imError) {
      console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
    });
    timGetmessage(then.data.liveDetail.chatGroup, 1)
  }).catch(function (imError) {
    console.warn('joinGroup error:', imError); // 申请加群失败的相关信息
  });
}

//退出群组
function quitGroup() {
  then.tim.quitGroup(String(then.data.liveDetail.chatGroup)).then(function (imResponse) {
    console.log(imResponse.data.groupID, '退出成功的群'); // 退出成功的群 ID
    // then.tim.off(TIM.EVENT.MESSAGE_RECEIVED, messageUplisten);
  }).catch(function (imError) {
    console.warn('quitGroup error:', '退群失败'); // 退出群组失败的相关信息
    // then.tim.off(TIM.EVENT.MESSAGE_RECEIVED, messageUplisten);
  });
}

//消息过滤
function messageFilter(params, type) {
  if (params.text) return 2
  switch (JSON.parse(params.data).customText) {
    case '0008043cc6f0647e061acf18dac98ef3': //进入直播
      return type ? 1 : -1
      break;
    case 'b6b7bc2d01bcb555795e9ed7ca5f84f5': //分享直播
      return 2
      break;
    case 'b13ace4737652a74ef2ff02349eab853': //关注直播
      return 3
      break;
    case '751e68f208e65780d52c1a0d53c6c8d4': //点赞直播
      return 4
      break;
    case 'ee07a26161938852c3bc78d8aa02479b': //直播重新进入直播间
      return -2
      break;
    case '79a5325920cb27c97654e65da37f5408': //主播结束直播
      return -4
      break;
    case '01ff35f1f878fe1ef0a1501707664b32': //主播暂时离开
      return -3
      break;
    case '5ef8580c35a92ce22aaad6154b186948': //后台结束直播解散房间
      return -4
      break;
    default:
      return 0
      break;
  }
}

//获取消息列表
function timGetmessage(roomId, isFirst) {
  then.tim.getMessageList({
    conversationID: `GROUP${roomId}`,
    nextReqMessageID: nextReqMessageID
  }).then(function (imResponse) {
    const messageList = imResponse.data.messageList; // 消息列表。
    nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
    const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
    const params = {
      customText: 'MD5_AUDIENCE_ENTER_LIVE',
      customType: '0',
      isShow: 'show',

    }
    // console.log(messageList, nextReqMessageID, isCompleted, '消息会话')
    if (isFirst) {
      const talkList = [{
          nick: '网上老年大学小助手',
          payload: {
            text: '欢迎来到直播间：<p> 1、请自行调节手机音量至合适的状态。</p> <p>2、听众发言可以在讨论区进行查看。</p>'
          }
        }],
        arr = []
      messageList.forEach(e => {
        let {
          nick,
          payload,
        } = e
        messageFilter(payload) > 0 ? arr.push({
          nick,
          payload: payload.text ? payload : JSON.parse(payload.data),
        }) : ''
      })
      then.data.talkList = arr.concat(talkList)
      if (messageList.length < 15) {
        then.setData({
          talkList: then.data.talkList
        })
      }
      customParams(params)
      timGetmessage(roomId)
    } else {
      const talkList = then.data.talkList,
        arr = []
      messageList.forEach(e => {
        let {
          nick,
          payload,
        } = e
        messageFilter(payload) > 0 ? arr.push({
          nick,
          payload: payload.text ? payload : JSON.parse(payload.data),
        }) : ''
      })
      then.data.talkList = arr.concat(talkList)
      if (messageList.length < 15 || then.data.talkList.length > 100) {
        then.setData({
          talkList: then.data.talkList
        })
        return
      }
      timGetmessage(roomId)
    }
  });
}

//发送普通文本消息
function sendTextMsg(detail) {
  // 1. 创建文本消息
  let message = then.tim.createTextMessage({
    to: String(then.data.liveDetail.chatGroup),
    conversationType: TIM.TYPES.CONV_GROUP,
    payload: {
      text: detail
    }
  });
  // 2. 发送消息
  then.tim.sendMessage(message).then(function (imResponse) {
    console.log(imResponse, '发送成功');
    const talkList = then.data.talkList
    talkList.push({
      nick: then.data.userInfo.nickname,
      payload: {
        text: detail
      }
    })
    then.setData({
      talkList
    })
  }).catch(function (imError) {
    console.warn('发送失败', imError);
  });
}

//自定义消息数据初始
function customParams(params) {
  let customParams = {
    customText: customText[params.customText],
    customType: params.customType,
    isShow: params.isShow,
    personCount: "0",
    attachContent: params.attachContent
  }
  sendCustomMessage(customParams)
}

//发送自定义文本消息
function sendCustomMessage(params) {
  let payload = {
    data: JSON.stringify(params),
    description: '',
    extension: ''
  }
  let message = then.tim.createCustomMessage({
    to: String(then.data.liveDetail.chatGroup),
    conversationType: TIM.TYPES.CONV_GROUP,
    payload
  });
  // 3. 发送消息
  then.tim.sendMessage(message).then(function (imResponse) {
    // 发送成功
    // console.log(imResponse, '发送成功');
    if (messageFilter(payload, 1) == 1 || messageFilter(payload, 1) == 4) {
      const specialList = then.data.specialList
      specialList.push({
        nick: then.data.userInfo.nickname,
        payload: params,
      })
      then.setData({
        specialList
      })
      return
    }
    const talkList = then.data.talkList
    talkList.push({
      nick: then.data.userInfo.nickname,
      payload: params,
    })
    then.setData({
      talkList
    })
  }).catch(function (imError) {
    // 发送失败
    console.warn('发送失败', imError);
  });
}

//更新消息列表 
function messageUp() {
  if (app.store.$state.messageReceived) return
  app.store.setState({
    messageReceived: 1
  })
  then.tim.on(TIM.EVENT.MESSAGE_RECEIVED, messageUplisten);
}



module.exports = {
  timInit,
  timLoginout,
  quitGroup,
  sendTextMsg,
  customParams
}