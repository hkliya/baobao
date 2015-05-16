angular.module('starter.services', ['ngResource'])

.factory('Users', function($resource) {
  return $resource('http://10.2.5.35:3000/users.json');
});
