'use strict';

/* Controllers */

angular.module('kasparGUI.controllers', [ 'dataModels', 'proxyService' ])
	.controller(
		'commonController', [ '$scope', function($scope) {	
			$scope.version = '3.0 Alpha 7';
		} ])
	.controller(
		'navBarController', [ '$scope', 'Menu', function($scope, Menu) {
			var m = Menu.get(function() {
				$scope.title = m.title;
				$scope.groups = m.groups;
			});
		} ])
	.controller(
		'operatorController', [ '$scope', 'Operator', 'User', 'proxyObjectResolver', function($scope, Operator, User, proxyObjectResolver) {
			$scope.operators = Operator.query(function() {
				$scope.selectedOperator = $scope.operators[0];
			});

			$scope.users = User.query();
			$scope.$watch('selectedOperator', function() {
				if($scope.selectedOperator != undefined) {
					proxyObjectResolver.resolveProp($scope.selectedOperator, 'users');
				}
			});

			$scope.newOperator = function() {
				var newOp = new Operator({fullname: 'New Operator', name:'New', users:[]});
				$scope.selectedOperator = newOp;
				$scope.operators.push(newOp);
			};
			
			$scope.deleteOperator = function(operator) {
//				operator.$delete(function() {
						$scope.operators.splice($scope.operators.indexOf(operator), 1);
						$scope.selectedOperator = $scope.operators[0];
	//				}
//				);
			};
			
			$scope.updateOperatorUser = function($event, operator, user) {
				var checkbox = $event.target;
				if (checkbox.checked) {
					operator.users.push(user);
				} else {
					for(var i = 0; i < operator.users.length; i++) {
						if (operator.users[i].id == user.id) {
							operator.users.splice(i, 1);
							break;
						}
					}
				}
			};
	}])
	.controller(
			'actionTestController', [ '$scope', '$http', '$q', '$timeout', 'Action', 'ActionType', function($scope, $state, $http, $q, $timeout, Action, ActionType) {
			$scope.running = false;
			$scope.actions = Action.query();
			$scope.output = '';
			$scope.startAction = function(action) {
				$scope.output += 'Start action' + action.name + '\n';
				$scope.running = true;
			};
			
			$scope.stopAction = function(action) {
				$scope.output += 'Stop action' + action.name + '\n';
				$scope.running = false;
			};
	}])
	.controller(
		'actionController', [ '$scope', '$state', '$http', '$q', '$timeout', 'Action', 'ActionType', function($scope, $state, $http, $q, $timeout, Action, ActionType) {
			$scope.action = '';
			$scope.actions = Action.query();
			ActionType.query(function(data){
					$scope.types = [];
					for(var i = 0; i < data.length; i++) {
						$scope.types.push(data[i].name);
					}
			});
			
			$scope.setFiles = function(element) {
		        $scope.$apply(function($scope) {
		            $scope.files = element.files;
		        });
		    };
			
		    $scope.newAction = function() {
		    	$scope.action = new Action({'name': 'New Action'});
		    	$scope.actions.push($scope.action);
		    };
		    
		    $scope.deleteAction = function(action) {
				$scope.actions.splice($scope.actions.indexOf(action), 1);
				$scope.action = $scope.actions[0];
		    }
		    
		    $scope.uploadSound = function(file) {
		    	var fd = new FormData();
		    	fd.append("data", file);
		    	var obj = $http
		    		.post('/api/action/sound/upload', fd, {
		    			header: {'Content-Type': undefined },
		    			transformRequest: angular.identity
		    		})
		    		.success(
		    				function(data, status, headers, config) { $scope.fileId = data; }
    				);
		    };
		    
			$scope.importFiles = function(files) {
				for(var i = 0; i < files.length; i++) {
					var fd = new FormData();
				    fd.append("data", files[i]);
	
				    var obj = $http
				    	.post('/api/action/import', fd,{
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
		'robotController', 
		['$scope', '$state', 'RobotType', 'Robot' , 'Servo', 'ServoConfig', 'ServoGroup', 'proxyObjectResolver',
		function($scope, $state, RobotType, Robot, Servo, ServoConfig, ServoGroup, proxyObjectResolver) {

			var items = Robot.query(function() {
				$scope.robots = items;
				$scope.selected = items[0];
				$scope.proxyObjectResolver = proxyObjectResolver;
			});

			var versions = RobotType.query(function() {
				$scope.versions = [];
				for (var i = 0; i < versions.length; i++) {
					$scope.versions.push(versions[i]['name']);
				}
			});

			$scope.newObj = function() {
				var newR = new Robot();
				$scope.robots.push(newR);
				$scope.selected = newR;
			};
			
			$scope.deleteObj = function(item) {
				item.$delete(function() {
					$scope.robots.splice($scope.items.indexOf(item), 1);
					$scope.selected = $scope.items[0];
				});
			};
			
			$scope.updateObj = function(item) {
				if (item.name != "" && item.version != "") {
					item.$save();
				}
			};
			
			$scope.viewJoints = function(robot) {
				$state.transitionTo('robot.view');
			};

			$scope.calibrateJoints = function(robot) {
				$state.transitionTo('robot.calibrate');
			};
		}])
	.controller(
		'userController', [ '$scope', '$filter', '$state', 'User', 'CustomAction', 'CustomTrigger', 'Action', 'Trigger', 'proxyObjectResolver', function($scope, $filter, $state, User, CustomAction, CustomTrigger, Action, Trigger, proxyObjectResolver) {
			$scope.users = User.query(function() {
				$scope.selectedUser = $scope.users[0];
			});
			
			$scope.$watch('selectedUser', function() {
				proxyObjectResolver.resolveProp($scope.selectedUser, 'customActions');
				proxyObjectResolver.resolveProp($scope.selectedUser, 'customActions');
			});
			
			$scope.newUser = function() {
				var newU = new User({fullname: 'New User', name:'New', customActions:[], customTriggers:[]});
				$scope.selectedUser = newU;
				$scope.users.push(newU);
			};
			
			$scope.deleteUser = function() {
//				$scope.selectedUser.$delete(function() {
						$scope.users.splice($scope.users.indexOf($scope.selectedUser), 1);
						$scope.selectedUser = $scope.users[0];
//					}
//				);
			};
//			
//			$scope.getActions = function(user) {
//				if(user === undefined) {
//					return Action.query();
//				} else {
//					return CustomAction.query({uid:user.id});
//				}
//			};
//			
//			$scope.getTriggers = function(user) {
//				if(user === undefined) {
//					return Trigger.query();
//				} else {
//					return CustomTrigger.query({uid:user.id});
//				}
//			};
//			
//			$scope.newAction = function() {
//				var newA = new CustomAction({name:'New Action', user_id:$scope.selectedUser.id});
//				$scope.selectedAction = newA;
//				$scope.selectedUser.actions.push(newA);
//				$state.transitionTo('user.customaction');
//			};
//			
//			$scope.newTrigger = function() {
//				var newA = new CustomTrigger({name:'New Trigger', user_id:$scope.selectedUser.id});
//				$scope.selectedTrigger = newA;
//				$scope.selectedUser.triggers.push(newA);
//				$state.transitionTo('user.customtrigger');
//			};
//			
//			$scope.deleteAction = function(action) {
//				action.$delete(function() {
//					$scope.selectedUser.actions.splice($scope.selectedUser.actions.indexOf(action), 1);
//					$scope.selectedUser.customactions.splice($scope.selectedUser.customActions.indexOf(actions.id), 1);
//				});
//			};
//			
//			$scope.deleteTrigger = function(trigger) {
//				trigger.$delete(function() {
//					$scope.selectedUser.triggers.splice($scope.selectedUser.triggers.indexOf(trigger), 1);
//					$scope.selectedUser.customtriggers.splice($scope.selectedUser.customTriggers.indexOf(trigger.id), 1);
//				});
//			};
//
//			$scope.updateUser = function(user) {
//				user.$save();
//			};
		}])
;