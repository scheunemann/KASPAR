'use strict';

define(function(require) {
	var angular = require('angular');
	require('angularResource');

	var ActionController = function($scope, $http, $q, $timeout, Action, ActionType) {
		$scope.action = '';
		$scope.actions = Action.query();
		ActionType.query(function(data) {
			$scope.types = [];
			for (var i = 0; i < data.length; i++) {
				$scope.types.push(data[i].name);
			}
		});

		$scope.setFiles = function(element) {
			$scope.$apply(function($scope) {
				$scope.files = element.files;
			});
		};

		$scope.newAction = function() {
			$scope.action = new Action({
				'name' : 'New Action'
			});
			$scope.actions.push($scope.action);
		};

		$scope.deleteAction = function(action) {
			$scope.actions.splice($scope.actions.indexOf(action), 1);
			$scope.action = $scope.actions[0];
		}

		$scope.uploadSound = function(file) {
			var fd = new FormData();
			fd.append("data", file);
			var obj = $http.post('/api/action/sound/upload', fd, {
				header : {
					'Content-Type' : undefined
				},
				transformRequest : angular.identity
			}).success(function(data, status, headers, config) {
				$scope.fileId = data;
			});
		};

		$scope.importFiles = function(files) {
			for (var i = 0; i < files.length; i++) {
				var fd = new FormData();
				fd.append("data", files[i]);

				var obj = $http.post('/api/action/import', fd, {
					headers : {
						'Content-Type' : undefined
					},
					transformRequest : angular.identity
				}).success(function(data, status, headers, config) {
					$scope.newobjs.push(data);
				}).error(function() {
					console.log("Error sending file:" + status);
				});
			}
		};
	};

	return [ '$scope', '$http', '$q', '$timeout', 'Action', 'ActionType', ActionController ];
});
