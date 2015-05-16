angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats, $location) {
  var user = $location.search().user;
  var appkey = "5556d21627302bb31589348e";
  var yunba = new Yunba({server: 'sock.yunba.io', port: 3000, appkey: appkey});
  yunba.init(function (success, a) {
    if (success) {
      yunba.connect_by_customid(user, function (success, msg, sessionid) {
        if (success) {
          console.log('你已成功连接到消息服务器，会话ID：' + sessionid);
          if (user == 1) {
            console.log('user = 1')
            subscribeTopic();
          } else {
            sendMessage();
          }
        } else {
          console.log(msg);
        }
      });
    } else {
      console.log("failed")
    }
  });

  var subscribeTopic = function() {
    yunba.subscribe({'topic': 'my_topic'}, function (success, msg) {
      if (success) {
        console.log('你已成功订阅频道：my_topic');
      } else {
        console.log(msg);
      }
    });

  };

  yunba.set_message_cb(function (data) {
    console.log('Topic:' + data.topic + ',Msg:' + data.msg);
  });

  var sendMessage = function() {
    yunba.publish({'topic': 'my_topic', 'msg': '你好！Yunba。'},
      function (success, msg) {
        if (success) {
          console.log('消息发布成功');
        } else {
          console.log(msg);
        }
      }
    );
  };

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
