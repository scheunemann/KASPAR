'use strict';

define(function(require) {
	var angular = require('angular');
	require('users/models');
	require('operators/models');

	var OperatorController = function($scope, Operator, User) {
		$scope.operators = Operator.query(function(operators) {
			$scope.selectedOperator = operators[0];
		});

		$scope.usersSaved = false;
		$scope.users = User.query();
		$scope.$watch('operatorsForm.$pristine', function(value) {
			if (!value) {
				$scope.usersSaved = false;
			}
		});

		$scope.saveOperator = function() {
			if ($scope.formCtrl.$valid) {
				if ($scope.selectedOperator.$fromServer) {
					$scope.selectedOperator.$save(function() {
						$scope.usersSaved = true;
						$scope.operatorsForm.$setPristine();
					});
				}
			}
		}

		$scope.newOperator = function() {
			var newOp = new Operator({
				fullname : '',
				name : '',
				users : []
			});
			$scope.selectedOperator = newOp;
			$scope.operators.push(newOp);
		};

		$scope.deleteOperator = function(operator) {
			operator.$delete();
			$scope.operators.splice($scope.operators.indexOf(operator), 1);
			$scope.selectedOperator = $scope.operators[0];
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

	return [ '$scope', 'Operator', 'User', OperatorController ];

});
