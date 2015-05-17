angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $http, $location, Yunba, $rootScope) {
  var getUserIdFromUsername = function(username) {
    if (username === 'tjd@163.com') {
      return 1;
    }
    return 2;
  };

  $scope.user = {};
  $scope.login = function() {
    var userId = getUserIdFromUsername($scope.user.name);
    $http.defaults.headers.common = {
      'user_id': userId
    };

    Yunba.init(userId);
    $location.path('/tab/dash');
  };
})
.controller('DashCtrl', function($scope, $location, Users, $ionicPopup, Yunba, $rootScope) {
  $scope.users = [];
  $scope.search = function() {
    $scope.users = Users.query();
    console.log($scope.users);
  };

  $scope.search();

  $scope.startChatWith = function(user) {
    Yunba.requestSession(user.id);

    var alertPopup = $ionicPopup.alert({
      title: '请稍等...',
      template: '等待' + user.name + ' 确认...',
      okText: '取消',
      okType: 'button-assertive'
    });
    alertPopup.then(function(res) {
      console.log('Thank you for not eating my delicious ice cream cone');
    });

    $rootScope.alertPopup = alertPopup;
  };
})

.controller('ChatsCtrl', function($scope) {
})

.controller('ChatDetailCtrl', function($scope, $stateParams, $location, $ionicPopup, Yunba, $rootScope) {
  var showConfirmDialog = function(userId) {
    var confirmPopup = $ionicPopup.confirm({
      title: '收到邀请',
      template: '确定要和对方聊天吗？'
    });
    confirmPopup.then(function(res) {
      if(res) {
        Yunba.confirmSession(userId);
      } else {
        console.log('You are not sure');
      }
    });
  };

  var showFeedbackDialog = function() {
    var myPopup = $ionicPopup.show({
        templateUrl: '../templates/feedback.html',
        title: '告诉对方你的感觉吧...',
        scope: $scope,
        buttons: [
        ]
      });
    myPopup.then(function(res) {
      console.log('Tapped!', res);
    });
    $scope.feedbackPopup = myPopup;
  };

  var isRequest = $location.search().isRequest;
  var requesterId = $location.path().match(/\/\w+\/(\d+)/)[1];
  console.log('isRequest:' + isRequest);
  if (isRequest) {
    showConfirmDialog(requesterId);
  } else {
    console.log($rootScope.alertPopup);
    if ($rootScope.alertPopup) {
      $rootScope.alertPopup.close();
    }
  }

  $scope.msg = {text: ''};
  $scope.sendMessage = function() {
    var text = $scope.msg.text;
    if (text === '') {
      return;
    }

    $scope.msg.text = '';
    Yunba.sendText(requesterId, text);
  }

  $scope.messages = function() {
    return $rootScope.messages;
  };

  $scope.endConversation = function() {
    showFeedbackDialog();
  };

  $scope.confirmFeedback = function(level) {
    $location.path('/tab/dash')
    $scope.feedbackPopup.close();
  };
})

.controller('AccountCtrl', function($scope, $location) {
  $scope.logout = function() {
    $location.path('/login')
  };
});
