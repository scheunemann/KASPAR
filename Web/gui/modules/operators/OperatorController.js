(function() {
	'use strict';

	var dependancies = [ 
	                     'angular', 
	                     'modules/common/services/proxyServices',
	                     'modules/users/models',
	                     'modules/operators/models',
	                     ];
	
	define(dependancies, function(
			angular, 
			proxyServices, 
			userModels, 
			operatorModels) {

		var OperatorController = function($scope, Operator, User, proxyObjectResolver) {
			$scope.operators = Operator.query(function() {
				$scope.selectedOperator = $scope.operators[0];
			});

			$scope.usersSaved = false;
			$scope.users = User.query();
			$scope.$watch('selectedOperator', function(operator) {
				proxyObjectResolver.resolveProp(operator, 'users');
			});

			$scope.$watch('operatorsForm.$pristine', function(value) {
				if (!value) {
					$scope.usersSaved = false;
				}
			});

			$scope.saveOperator = function() {
				if ($scope.formCtrl.$valid) {
					$scope.selectedOperator.$save(function() {
						$scope.usersSaved = true;
						$scope.operatorsForm.$setPristine();
						proxyObjectResolver.resolveProp($scope.selectedOperator, 'users');
					});
				}
			}

			$scope.newOperator = function() {
				var newOp = new Operator({
					fullname : 'New Operator',
					name : 'New',
					users : []
				});
				$scope.selectedOperator = newOp;
				$scope.operators.push(newOp);
			};

			$scope.deleteOperator = function(operator) {
				// operator.$delete(function() {
				$scope.operators.splice($scope.operators.indexOf(operator), 1);
				$scope.selectedOperator = $scope.operators[0];
				// }
				// );
			};

			$scope.updateOperatorUser = function($event, users, user) {
				if (users == undefined) { return; }

				var checkbox = $event.target;
				if (checkbox.checked) {
					users.push(user);
				} else {
					for (var i = 0; i < users.length; i++) {
						if (users[i].id == user.id) {
							users.splice(i, 1);
							break;
						}
					}
				}

				$scope.saveOperator();
			};
		};

		return [ '$scope', 'Operator', 'User', 'proxyObjectResolver', OperatorController ];

	});
}());
