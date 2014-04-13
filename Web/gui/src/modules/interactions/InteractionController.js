'use strict';

define(function(require) {
	var angular = require('angular');
	require('operators/models');
	require('users/models');
	require('triggers/models');
	require('interactions/models');

	var InteractionController = function($q, $scope, Operator, User, Interaction, ButtonTrigger, language) {
		$scope.language = language.getText();
		$scope.operators = Operator.query();
		$scope.users = User.query();
		$scope.interaction = null;
		$scope.keyBind = true;
		$scope.showHotKeys = true;
		var activeInteractions = Interaction.query({
			endTime : null
		});
		activeInteractions.$promise.then(function(result) {
			if (result != undefined && result.length > 0) {
				$scope.interaction = result[0];
				$scope.operator_id = $scope.interaction.operator_id;
				$scope.user_id = $scope.interaction.user_id;
			}
		});

		$scope.buttons = ButtonTrigger.query();

		$scope.start = function() {
			$scope.interaction = new Interaction({
				startTime : new Date(),
				user_id : $scope.user_id,
				robot_id : $scope.robot.id,
				operator_id : $scope.operator_id,
			});

			$scope.interaction.$save();
		};

		$scope.stop = function() {
			$scope.interaction.endTime = new Date();
			$scope.interaction.$save().then(function() {
				$scope.interaction = null;
			});
		};

		$scope.getCategory = function(user, userList) {
			if (userList == undefined || user == undefined) { return; }
			for (var i = 0; i < userList.length; i++) {
				if (userList[i].id == user.id) { return "Common"; }
			}

			return "All";
		};
	};

	return [ '$q', '$scope', 'Operator', 'User', 'Interaction', 'ButtonTrigger', 'language', InteractionController ];
});
