'use strict';

/* Controllers */

angular.module('kasparGUI.controllers', []).
  controller('navBarController', ['$scope', '$http', function($scope, $http) {
	  $http.get('/api/menuOptions').success(function(data, status, headers, config) {
		  $scope.title = data['title'];
		  $scope.groups = data['groups'];
	  });
  }])
  .controller('MyCtrl2', [function() {

  }])
  .controller('commonController', ['$scope', function($scope) {
    $scope.version = '3 alpha';
}]);