angular.module('starter.services', ['ngResource'])

.factory('Users', function($resource) {
  return $resource('http://10.2.5.35:3000/users.json');
})
.factory('Yunba', function($location, $rootScope) {
  var appkey = "5556d21627302bb31589348e";
  var yunba = new Yunba({server: 'sock.yunba.io', port: 3000, appkey: appkey});

  var subscribeTopic = function(topicName) {
    yunba.subscribe({'topic': topicName}, function (success, msg) {
      if (success) {
        console.log('你已成功订阅频道：' + topicName);
      } else {
        console.log(msg);
      }
    });
    yunba.set_message_cb(function (data) {
      console.log('Topic:' + data.topic + ',Msg:' + data.msg);
      var obj = JSON.parse(data.msg);
      if (obj.cmd === 'requestSession') {
        $location.path('/tab/chats/' + obj.srcTopic.substring(obj.srcTopic.length - 1, obj.srcTopic.length));
        $rootScope.$apply();
      }
      // $scope.msgList.push({ avatar: 'http://ionicframework.com/img/docs/venkman.jpg', text: data.msg, is_sender: false});
      // $scope.$apply();
    });
  };

  var userId = '';
  var init = function(userId) {
    this.userId = userId;
    yunba.init(function (success, a) {
      if (success) {
        yunba.connect_by_customid(new Date().getTime(), function (success, msg, sessionid) {
          if (success) {
            console.log('你已成功连接到消息服务器，会话ID：' + sessionid);
            subscribeTopic('Topic-' + userId);
          } else {
            console.log(msg);
          }
        });
      } else {
        console.log("failed")
      }
    });
  };

  var sendMessage = function(to, text) {
    yunba.publish({'topic': 'Topic-' + to, 'msg': text}, function (success, msg) {
      if (success) {
        // $scope.msgList.push({ avatar: 'http://ionicframework.com/img/docs/venkman.jpg', text: text, is_sender: true });
        // $scope.$apply();
        console.log('消息发布成功, to=' + to + ', text:' + text);
      } else {
        console.log(msg);
      }
    });
  };

  var constructMessage = function(userId) {
     var str = {"cmd": "requestSession", "srcTopic": 'Topic-' + userId};
     return JSON.stringify(str);
  };

  var requestSession = function(userId) {
    console.log(userId)
    sendMessage(userId, constructMessage(userId));
  };

  return {
    init: init,
    requestSession: requestSession
  }
});
