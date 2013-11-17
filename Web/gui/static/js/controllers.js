'use strict';

/* Controllers */

angular.module('kasparGUI.controllers', [ 'dataModels', 'proxyService', 'ui.router', ])
	.controller(
		'commonController', [ '$scope', function($scope) {	
			$scope.version = '3.0 Alpha 7';
		} ])
	.controller(
		'navBarController', [ '$scope', '$state', 'Menu', function($scope, $state, Menu) {
			Menu.get(function(m) {
				$scope.title = m.title;
				$scope.groups = m.groups;
			});
			
			$scope.state = $state;
		} ])
	.controller(
		'interactionController', [ '$scope', 'Operator', 'User', 'proxyObjectResolver', function($scope, Operator, User, proxyObjectResolver) {
			$scope.operators = Operator.query();
			$scope.users = User.query();
			$scope.proxyObjectResolver = proxyObjectResolver;

			$scope.getCategory = function(user, userList) {
				if(userList == undefined || user == undefined) {
					return;
				}
				for(var i = 0; i < userList.length; i++) {
					if (userList[i].id == user.id) {
						return "Common";
					}
				}
				
				return "All";
			};
	}])
	.controller(
		'operatorController', [ '$scope', 'Operator', 'User', 'proxyObjectResolver', function($scope, Operator, User, proxyObjectResolver) {
			$scope.operators = Operator.query(function() {
				$scope.selectedOperator = $scope.operators[0];
			});

			$scope.usersSaved = false;
			$scope.users = User.query();
			$scope.$watch('selectedOperator', function() {
				if($scope.selectedOperator != undefined) {
					proxyObjectResolver.resolveProp($scope.selectedOperator, 'users');
				}
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
					});
				}
			}

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
				
				$scope.saveOperator();
			};
	}])
	.controller(
			'actionTestController', [ '$scope', '$http', '$q', '$timeout', 'Action', 'ActionTest', function($scope, $http, $q, $timeout, Action, ActionTest) {
			$scope.running = false;
			$scope.actions = Action.query();
			$scope.output = '';
			
			$scope.$watch('action', function(action) {
				if(action != undefined) {
					$scope.actionTest = new ActionTest({'id': action.id});
				}
			});
			
			$scope.startAction = function(action) {
				$scope.output += 'Start action ' + action.name + '\n';
				$scope.actionTest.$save(getOutput());
			};
			
			var getOutput = function() {
				$scope.output += 'TODO: live update of running actions\n';
			}
			
			$scope.stopAction = function(action) {
				$scope.output += 'TODO: Stop action ' + action.name + '\n';				
			};
	}])
	.controller(
		'actionController', [ '$scope', '$http', '$q', '$timeout', 'Action', 'ActionType', function($scope, $http, $q, $timeout, Action, ActionType) {
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
		'triggerController', [ '$scope', '$http', '$q', '$timeout', 'Action', 'Trigger', 'TriggerType', function($scope, $http, $q, $timeout, Action, Trigger, TriggerType) {
			$scope.trigger = '';
			$scope.triggers = Trigger.query();
			$scope.actions = Action.query();
			TriggerType.query(function(data){
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
			
		    $scope.newTrigger = function() {
		    	$scope.trigger = new Trigger({'name': 'New Trigger'});
		    	$scope.triggers.push($scope.trigger);
		    };
		    
		    $scope.deleteTrigger = function(trigger) {
				$scope.triggers.splice($scope.triggers.indexOf(trigger), 1);
				$scope.trigger = $scope.triggers[0];
		    }
		    
			$scope.importFiles = function(files) {
				for(var i = 0; i < files.length; i++) {
					var fd = new FormData();
				    fd.append("data", files[i]);
	
				    var obj = $http
				    	.post('/api/trigger/import', fd,{
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
		['$scope', '$state', 'RobotModel', 'Robot' , 'Servo', 'ServoConfig', 'ServoGroup', 'proxyObjectResolver',
		function($scope, $state, RobotModel, Robot, Servo, ServoConfig, ServoGroup, proxyObjectResolver) { 
			$scope.proxyObjectResolver = proxyObjectResolver;
			$scope.robots = Robot.query();
			$scope.connected = false;
						
			$scope.connect = function(robot) {
				$scope.connected = true;
			}
			
			$scope.disconnect = function(robot) {
				$scope.connected = false;
			}
		}])
	.controller(
		'userController', [ '$scope', '$filter', 'User', 'CustomAction', 'CustomTrigger', 'Action', 'Trigger', 'proxyObjectResolver', function($scope, $filter, User, CustomAction, CustomTrigger, Action, Trigger, proxyObjectResolver) {
			$scope.users = User.query(function() {
				$scope.selectedUser = $scope.users[0];
			});
			
			$scope.$watch('selectedUser', function() {
				proxyObjectResolver.resolveProp($scope.selectedUser, 'customActions');
				proxyObjectResolver.resolveProp($scope.selectedUser, 'customTriggers');
			});

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
		}])
;