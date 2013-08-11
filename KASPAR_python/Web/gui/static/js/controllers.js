'use strict';

/* Controllers */

angular.module('kasparGUI.controllers', [ 'dataModels' ])
	.controller(
		'navBarController', [ '$scope', 'Menu', function($scope, Menu) {
			var m = Menu.get(function() {
				$scope.title = m.title;
				$scope.groups = m.groups;
			});
		} ])
	.controller(
		'operatorController', [ '$scope', '$filter', 'Operator', 'User', function($scope, $filter, Operator, User) {
			var o = Operator.query(function() {
				$scope.operators = o;
				$scope.selectedOperator = o[0];
			});

			var u = User.query(function() {
				$scope.users = u;
			});

			$scope.isOperatorUser = function(userId) {
				return $filter('filter')($scope.selectedOperator.users, userId).length == 1;
			};
			
			$scope.newOperator = function() {
				var newOp = new Operator({fullname: 'New Operator', name:'New'});
				$scope.selectedOperator = newOp;
				$scope.operators.push(newOp);
			};
			
			$scope.deleteOperator = function() {
				$scope.selectedOperator.$delete(function() {
						$scope.operators.splice($scope.operators.indexOf($scope.selectedOperator), 1);
						$scope.selectedOperator = $scope.operators[0];
					}
				);
			};
			
			$scope.updateOperatorUser = function($event, userId) {
				var checkbox = $event.target;
				if (checkbox.checked) {
					$scope.selectedOperator.users.push(userId);
				} else {
					$scope.selectedOperator.users.splice($scope.selectedOperator.users.indexOf(userId), 1);
				}
				
				$scope.updateOperator($scope.selectedOperator);
			};
			
			$scope.updateOperator = function(operator) {
				operator.$save();
			}
		}])
	.controller(
		'commonController', [ '$scope', function($scope) {	
			$scope.version = '3 alpha';
		} ]);