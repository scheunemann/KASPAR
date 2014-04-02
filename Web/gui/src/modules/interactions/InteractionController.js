'use strict';

define(function(require) {
	var angular = require('angular');
	require('operators/models');
	require('users/models');
	require('triggers/models');
	require('interactions/models');

	var InteractionController = function($q, $scope, Operator, User, Interaction, Trigger) {
		$scope.operators = Operator.query();
		$scope.users = User.query();
		$scope.interaction = null;
		$scope.keyBind = true;
		$scope.showHotKeys = true;
		Interaction.query({
			endTime : 'null'
		}, function(result) {
			if (result != undefined && result.length > 0) {
				$scope.interaction = result[0];
				for (var i = 0; i < $scope.operators.length; i++) {
					if ($scope.operators[i].id == $scope.interaction.operator_id) {
						$scope.operator = $scope.operators[i];
						break;
					}
				}

				for (var i = 0; i < $scope.users.length; i++) {
					if ($scope.users[i].id == $scope.interaction.users[0].id) {
						$scope.user = $scope.users[i];
						break;
					}
				}
			}
		});

		$scope.buttons = Trigger.query({
			'type' : 'Button'
		});

		$scope.start = function() {
			$scope.interaction = new Interaction({
				startTime : new Date(),
				users : [ $scope.user ],
				robot : $scope.robot,
				operator : $scope.operator,
			});

			$scope.interaction.$save();
		};

		$scope.stop = function() {
			$scope.interaction.endTime = new Date();
			$scope.interaction.$save();
			$scope.interaction = null;
		};

		$scope.getCategory = function(user, userList) {
			if (userList == undefined || user == undefined) { return; }
			for (var i = 0; i < userList.length; i++) {
				if (userList[i].id == user.id) { return "Common"; }
			}

			return "All";
		};
	};

	return [ '$q', '$scope', 'Operator', 'User', 'Interaction', 'Trigger', InteractionController ];
});
