'use strict';

define([ 
        'angular', 
        'actions/models',
        'triggers/models',
        ], function(angular, Action, Trigger, TriggerType) {

	var TriggerController = function($scope, $http, $q, $timeout, Action, Trigger, TriggerType) {
		$scope.trigger = null;
		$scope.triggers = Trigger.query();
		$scope.actions = Action.query();
		$scope.newobjs = [];
		TriggerType.query(function(data) {
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

		$scope.newTrigger = function() {
			$scope.trigger = new Trigger({
				'name' : 'New Trigger'
			});
			$scope.triggers.push($scope.trigger);
		};

		$scope.deleteTrigger = function(trigger) {
			$scope.triggers.splice($scope.triggers.indexOf(trigger), 1);
			$scope.trigger = $scope.triggers[0];
			trigger.$delete();
		}

		$scope.importFiles = function(files) {
			for (var i = 0; i < files.length; i++) {
				var fd = new FormData();
				fd.append("data", files[i]);

				var obj = $http.post('/api/trigger/import', fd, {
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

	return [ '$scope', '$http', '$q', '$timeout', 'Action', 'Trigger', 'TriggerType', TriggerController ];
});
