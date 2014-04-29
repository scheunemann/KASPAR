'use strict';

define(function(require) {
	var angular = require('angular');
	require('actions/models');
	require('actions/directives');

	var ActionController = function($scope, Action, ActionType, language) {
		$scope.language = language.getText();
		$scope.actions = Action.query();
		$scope.types = ActionType.query();

		$scope.$watch('action', function(action) {
			if (action != undefined) {
				var abstractAction = $scope.action;
				var concreteAction = $scope.action.getConcreteClassInstance();
				concreteAction.$promise.then(function() {
					$scope.actions[$scope.actions.indexOf(abstractAction)] = concreteAction;
					$scope.action = concreteAction;
				});
			}
		});

		$scope.setFiles = function(element) {
			$scope.$apply(function($scope) {
				$scope.files = element.files;
			});
		};

		$scope.newAction = function() {
			$scope.action = new Action({
				type : 'Action'
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

	return [ '$scope', 'Action', 'ActionType', 'language', ActionController ];
});
