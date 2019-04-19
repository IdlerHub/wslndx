var httpService = require('../utils/service.js');

//POST Shortvideo/lists 获取短视频列表
function list(param, from) {
    if (from) {
        //POST shortvideo/nologinlists 从分享获取短视频列表
        return httpService.noLoginPost('shortvideo/nologinlists', param);
    } else {
        return httpService.post('Shortvideo/lists', param);
    }

}


//POST Shortvideo/praise 点赞
function praise(param) {
   return  httpService.post('Shortvideo/praise', param);
}

//POST Shortvideo/praiseCancel 取消点赞
function delPraise(param) {
  return   httpService.post('Shortvideo/praiseCancel', param);
}

//POST Shortvideo/forward 分享
function share(param) {
   return  httpService.post('Shortvideo/forward', param);
}

module.exports = {
    list: list,
    praise: praise,
    delPraise: delPraise,
    share: share

}