angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $location, Users) {
  $scope.users = [];
  $scope.search = function() {
    $scope.users = Users.query();
    console.log($scope.users);
  };
  $scope.startChatWith = function(userId) {
    $location.path('/tab/chats/' + userId);
  };
})

.controller('ChatsCtrl', function($scope) {
})

.controller('ChatDetailCtrl', function($scope, $stateParams, $location) {
  var user = $location.search().user;
  var appkey = "5556d21627302bb31589348e";
  var yunba = new Yunba({server: 'sock.yunba.io', port: 3000, appkey: appkey});
  yunba.init(function (success, a) {
    if (success) {
      yunba.connect_by_customid(new Date().getTime(), function (success, msg, sessionid) {
        if (success) {
          console.log('你已成功连接到消息服务器，会话ID：' + sessionid);
          if (user == 1) {
            console.log('user = 1')
            subscribeTopic();
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
    $scope.msgList.push({ avatar: 'http://ionicframework.com/img/docs/venkman.jpg', text: data.msg, is_sender: false});
    $scope.$apply();
  });

  $scope.msg = { text: '' };
  $scope.sendMessage = function() {
    var text = $scope.msg.text;
    if (text === '') {
      return;
    }

    yunba.publish({'topic': 'my_topic', 'msg': text},
      function (success, msg) {
        if (success) {
          $scope.msgList.push({ avatar: 'http://ionicframework.com/img/docs/venkman.jpg', text: text, is_sender: true});
          $scope.$apply();
          console.log('消息发布成功');
        } else {
          console.log(msg);
        }
      }
    );
  }

  $scope.msgList = [];
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
