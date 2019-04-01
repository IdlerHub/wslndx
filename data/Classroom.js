var httpService = require('../utils/service.js');

//POST Classroom/recommend 微课堂推荐列表
function recommend(param,successFn, failFn) {
  httpService.post('Classroom/recommend', param, function (data) {
    if (successFn) {
      successFn(data);
    }
  }, function (err) {
    if (failFn) {
      failFn(err);
    }
  },true);
}

//POST Classroom/detail 微课堂视频详情
function detail(param, successFn, failFn) {
  httpService.post('Classroom/detail', param, function (data) {
    if (successFn) {
      successFn(data);
    }
  }, function (err) {
    if (failFn) {
      failFn(err);
    }
  });
}

//POST Classroom/category 微课堂分类
function category(successFn, failFn) {
  httpService.post('Classroom/category', '', function (data) {
    if (successFn) {
      successFn(data);
    }
  }, function (err) {
    if (failFn) {
      failFn(err);
    }
  },true);
}

//POST Classroom/lessons 筛选课程
function lessons(param, successFn, failFn) {
  httpService.post('Classroom/lessons', param, function (data) {
    if (successFn) {
      successFn(data);
    }
  }, function (err) {
    if (failFn) {
      failFn(err);
    }
  },true);
}

//POST Classroom/recordAdd 添加播放记录课程
function recordAdd(param, successFn, failFn) {
  httpService.post('Classroom/recordAdd', param, function (data) {
    if (successFn) {
      successFn(data);
    }
  }, function (err) {
    if (failFn) {
      failFn(err);
    }
  });
}

//POST Classroom/collect 收藏视频
function collect(param, successFn, failFn) {
  httpService.post('Classroom/collect', param, function (data) {
    if (successFn) {
      successFn(data);
    }
  }, function (err) {
    if (failFn) {
      failFn(err);
    }
  });
}

//POST Classroom/collectCancel 取消收藏视频
function collectCancel(param, successFn, failFn) {
  httpService.del('Classroom/collectCancel', param, function (data) {
    if (successFn) {
      successFn(data);
    }
  }, function (err) {
    if (failFn) {
      failFn(err);
    }
  });
}

module.exports = {
  recommend: recommend,
  detail: detail,
  category: category,
  lessons: lessons,
  recordAdd: recordAdd,
  collect: collect,
  collectCancel: collectCancel
}