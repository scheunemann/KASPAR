(function() {
	'use strict';
	
	var dependancies = [ 
	                     'angular', 
	                     'modules/common/services/proxyServices',
	                     'modules/operators/models',
	                     'modules/users/models',
	                     'modules/triggers/models',
	                     'modules/interactions/models',
	                     ];
	
	define(dependancies, function(
			angular, 
			proxyServices, 
			Operator, 
			User, 
			Trigger,
			Interaction) {

		var InteractionController = function($q, $scope, Operator, User, Interaction, Trigger, proxyObjectResolver) {
			$scope.operators = Operator.query();
			$scope.users = User.query();
			$scope.proxyObjectResolver = proxyObjectResolver;
			$scope.interaction = null;
			$scope.keyBind = true;
			$scope.showHotKeys = true;
			Interaction.query({
				endTime : 'null'
			}, function(result) {
				if (result != undefined && result.length > 0) {
					$scope.interaction = result[0];
					proxyObjectResolver.resolveProp($scope.interaction, 'operator', function(iOperator) {
						proxyObjectResolver.resolveProp($scope.interaction, 'users', function(iUsers) {
							$q.all($scope.operators.$promise, $scope.users.$promise).then(function() {
								for (var i = 0; i < $scope.operators.length; i++) {
									if ($scope.operators[i].id == iOperator.id) {
										$scope.operator = $scope.operators[i];
										break;
									}
								}

								for (var i = 0; i < $scope.users.length; i++) {
									if ($scope.users[i].id == iUsers[0].id) {
										$scope.user = $scope.users[i];
										break;
									}
								}
							});
						});
					});
				}
			});

			$scope.$watch('operator', function(operator) {
				proxyObjectResolver.resolveProp(operator, 'users');
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

		return [ '$q', '$scope', 'Operator', 'User', 'Interaction', 'Trigger', 'proxyObjectResolver', InteractionController ];
	});
}());