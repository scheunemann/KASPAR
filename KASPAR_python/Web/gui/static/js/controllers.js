'use strict';

/* Controllers */

angular.module('kasparGUI.controllers', [ 'dataModels' ])
	.controller(
		'commonController', [ '$scope', function($scope) {	
			$scope.version = '3.0 Alpha 2';
		} ])
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
		'actionController', [ '$scope', '$state', '$http', 'Action', 'ActionType', function($scope, $state, $http, Action, ActionType) {
			$scope.newobjs = [];
			
			var types = ActionType.query(function() {
				$scope.types = types;
				$scope.selectedType = types[0];
			});
			
			$scope.typeChange = function(type) {
				$state.transitionTo('action.edit.' + type.name.toLowerCase());
			};
	
			$scope.setFiles = function(element) {
		        $scope.$apply(function($scope) {
		            $scope.files = element.files;
		        });
		    };
			
			$scope.uploadFiles = function(files) {
				for(var i = 0; i < files.length; i++) {
					var fd = new FormData();
				    fd.append("data", files[i]);
	
				    var obj = $http
				    	.post('/api/action/upload', fd,{
				            headers: {'Content-Type': undefined },
				            transformRequest: angular.identity
				        })
				    	.success(
				    		function(data, status, headers, config) { $scope.newobjs.push(data); }
				    	)
				    	.error(
		    				function() { console.log("Error sending file:" + status); }
			    		);
				}
			};
		}])
	.controller(
		'robotController', ['$scope', 'RobotType', 'Robot' , function($scope, RobotType, Robot) {
			var items = Robot.query(function() {
				$scope.items = items;
				$scope.selected = items[0];
			});
			
			var versions = RobotType.query(function() {
				$scope.versions = [];
				for (var i = 0; i < versions.length; i++) {
					$scope.versions.push(versions[i]['name']);
				}
			});
			
			$scope.newObj = function() {
				var newR = new Robot({name: 'New Robot', version:$scope.versions[0]});
				$scope.items.push(newR);
				$scope.selected = newR;
			};
			
			$scope.deleteObj = function(item) {
				item.$delete(function() {
					$scope.items.splice($scope.items.indexOf(item), 1);
					$scope.selected = $scope.items[0];
				});
			};
			
			$scope.updateObj = function(item) {
				item.$save();
			};
		}])
	.controller(
		'userController', [ '$scope', '$filter', '$state', 'User', 'CustomAction', 'CustomTrigger', 'Action', 'Trigger', function($scope, $filter, $state, User, CustomAction, CustomTrigger, Action, Trigger) {
			var u = User.query(function() {
				$scope.users = u;
				$scope.selectedUser = u[0];
				$scope.selectedUser.actions = $scope.getActions($scope.selectedUser);
				$scope.selectedUser.triggers = $scope.getTriggers($scope.selectedUser);
			});

			$scope.newUser = function() {
				var newU = new User({fullname: 'New User', name:'New'});
				$scope.selectedUser = newU;
				$scope.selectedUser.actions = [];
				$scope.selectedUser.triggers = [];
				$scope.users.push(newU);
			};
			
			$scope.deleteUser = function() {
				$scope.selectedUser.$delete(function() {
						$scope.users.splice($scope.users.indexOf($scope.selectedUser), 1);
						$scope.selectedUser = $scope.users[0];
					}
				);
			};
			
			$scope.getActions = function(user) {
				if(user === undefined) {
					return Action.query();
				} else {
					return CustomAction.query({uid:user.id});
				}
			};
			
			$scope.getTriggers = function(user) {
				if(user === undefined) {
					return Trigger.query();
				} else {
					return CustomTrigger.query({uid:user.id});
				}
			};
			
			$scope.newAction = function() {
				var newA = new CustomAction({name:'New Action', user_id:$scope.selectedUser.id});
				$scope.selectedAction = newA;
				$scope.selectedUser.actions.push(newA);
				$state.transitionTo('user.customaction');
			};
			
			$scope.newTrigger = function() {
				var newA = new CustomTrigger({name:'New Trigger', user_id:$scope.selectedUser.id});
				$scope.selectedTrigger = newA;
				$scope.selectedUser.triggers.push(newA);
				$state.transitionTo('user.customtrigger');
			};
			
			$scope.deleteAction = function(action) {
				action.$delete(function() {
					$scope.selectedUser.actions.splice($scope.selectedUser.actions.indexOf(action), 1);
					$scope.selectedUser.customactions.splice($scope.selectedUser.customActions.indexOf(actions.id), 1);
				});
			};
			
			$scope.deleteTrigger = function(trigger) {
				trigger.$delete(function() {
					$scope.selectedUser.triggers.splice($scope.selectedUser.triggers.indexOf(trigger), 1);
					$scope.selectedUser.customtriggers.splice($scope.selectedUser.customTriggers.indexOf(trigger.id), 1);
				});
			};

			$scope.updateUser = function(user) {
				user.$save();
			};
		}])		
;