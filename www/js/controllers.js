angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  console.log('----')
  var appkey = "5556d21627302bb31589348e";
  var yunba = new Yunba({server: 'sock.yunba.io', port: 3000, appkey: appkey});
  yunba.init(function (success, a) {
    if (success) {
      yunba.connect_by_customid('1', function (success, msg, sessionid) {
        if (success) {
          console.log('你已成功连接到消息服务器，会话ID：' + sessionid);
        } else {
          console.log(msg);
        }
      });
    } else {
      console.log("failed")
    }
  });

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
