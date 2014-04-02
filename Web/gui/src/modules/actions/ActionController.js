'use strict';

define(function(require) {
	var angular = require('angular');
	require('actions/models');
	require('actions/directives');

	var ActionController = function($scope, Action, ActionType) {
		$scope.action = '';
		$scope.actions = Action.query();
		$scope.types = ActionType.query();

		$scope.setFiles = function(element) {
			$scope.$apply(function($scope) {
				$scope.files = element.files;
			});
		};

		$scope.newAction = function() {
			$scope.action = new Action();
			$scope.actions.push($scope.action);
		};

		$scope.deleteAction = function(action) {
			$scope.actions.splice($scope.actions.indexOf(action), 1);
			$scope.action = $scope.actions[0];
		}

		$scope.uploadSound = function(file) {
			var fd = new FormData();
			fd.append("data", file);
			var obj = $http.post('/api/SoundAction/upload', fd, {
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

				var obj = $http.post('/api/Action/Import', fd, {
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

	return [ '$scope', 'Action', 'ActionType', ActionController ];
});
