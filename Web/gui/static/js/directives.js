'use strict';

/* Directives */
angular.module('kasparGUI.directives', [ 'proxyService', 'dataModels', 'kasparGUI.filters']).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('model', [function() {
	  var def = {
		  restrict : 'A',
		  require : 'form',
		  link : function(scope, element, attrs, controller) {
			  scope.formCtrl = controller;
			  attrs.$observe('model', function(modelName) {
				  scope.$watch(modelName, function(modelInstance) {
					  scope.model = modelInstance;
				  });
			  });
		  },
		  controller : function($scope) {
			this.updateObj = function(modelCtrl) {
				if ($scope.formCtrl.$valid) {
					$scope.model.$save(function() {
						modelCtrl.$setPristine();
					});
				}
			};

			this.newObj = function(type) {
				var newO = new type();
				if (list != undefined) {
					list.push(newO);
				}
				return newO;
			};

			this.deleteObj = function() {
				return item.$delete(function() {
					var select = null;
					if (list != undefined) {
						list.splice(list.indexOf(item), 1);
						if (list.length > 0) {
							select = list[0];
						}
					}

					return select;
				});
			};
		}
	  };
	  return def;
  }])
  .directive('saveable', ['$compile', function($compile) {
	  var def = {
		restrict : 'A',
		require : ['ngModel', '^form', '^model'],
        link: function(scope, element, attrs, controllers) {
        	var name = controllers[1].$name + "." + controllers[0].$name;
        	var updateCalled = false;
        	var parentElement = angular.element(element[0].parentElement);
        	var modelCtrl = controllers[0];
        	var saveCtrl = controllers[2];
			
			scope.$watch(name + '.$dirty', function(value) {
				if(value) {
					parentElement.addClass('has-warning');
				} else {
					parentElement.removeClass('has-warning');
				}
			});
					
			scope.$watch(name + '.$valid', function(value) {
				if (modelCtrl.$dirty) {
					if (value) {
						parentElement.removeClass('has-error');
					} else {
						parentElement.addClass('has-error');
					}
				}
			});

			scope.$watch(name + '.$pristine', function(value) {
				if (!value) {
					parentElement.removeClass('has-success');
				} else if (updateCalled) {
					parentElement.addClass('has-success');
					updateCalled = false;
				}
			});
			
			var callUpdate = function() {
				if (modelCtrl.$dirty && modelCtrl.$valid) {
					saveCtrl.updateObj(modelCtrl);
					updateCalled = true;
				}
			}
			
			element.on('blur', function() {
				callUpdate();
			});
			
			element.on('keyup', function($event) {
				var code = $event.which || $event.keyCode; // Not-IE || IE
				if (code == 13) { // enter key
					callUpdate();
				}
			});
        }
	}

	return def;
  }])
  .directive('notEmpty', [function() {
	  var def = {
			  restrict : 'A',
			  require : 'ngModel',
			  link : function(scope, element, attrs, controller) {
				  controller.$parsers.unshift(function(value) {
					  if (value == undefined || value == "") {
						  ctrl.$setValidity('notEmpty', false);
						  return undefined;
					  } else {
						  ctrl.$setValidity('notEmpty', true);
					  }
				  });
			  }
	  }
	  
	  return def;
  }])
  .directive('robotEditor', ['RobotModel', function(RobotModel) {
		var def = {
				templateUrl: 'static/partials/robot/edit.html',
				restrict: 'E',
				scope: {
					robot: "=",
		        },
		        controller: function($scope) {
					var versions = RobotModel.query(function() {
						$scope.versions = [];
						for (var i = 0; i < versions.length; i++) {
							$scope.versions.push(versions[i]['name']);
						}
					});
					
					$scope.viewJoints = function(robot) {
						$state.transitionTo('robot.view');
					};

					$scope.calibrateJoints = function(robot) {
						$state.transitionTo('robot.calibrate');
					};
		        }
			  };

	return def;
  }])
  .directive('actionEditor', ['$compile', function($compile) {
		var def = {
				restrict: 'E',
				scope: {
					type: "=",
		            action: "=",
		            actions: "=",
		        },
		        link: function(scope, iElement, iAttrs, controller) {
		        	scope.$watch('type', function(newType) {
		        		if (newType != "" && newType != undefined) {
		        			if(newType.toLowerCase() == "group" || newType.toLowerCase() == "sequence") {
			        			iElement.html('<' + newType + '-editor action="action" actions="actions"></' + newType + '-editor>');
		        			} else {
			        			iElement.html('<' + newType + '-editor action="action"></' + newType + '-editor>');
		        			}
				        	$compile(iElement.contents())(scope);
		        		} else {
		        			iElement.html('');
		        			$compile(iElement.contents())(scope);
		        		}
		        	});
		        },
			  };

	return def;
  }])
  .directive('poseEditor', ['JointPosition', function(JointPosition) {
	  var def = {
				templateUrl: 'static/partials/action/pose.html',
				restrict: 'E',
				scope: {
		            pose: "=action",
		        },
		        controller: function($scope) {
		        }
  	  };

	  return def;
  }])
  .directive('robotInterface', ['Robot', 'proxyObjectResolver', function(Robot, proxyObjectResolver) {
	  var def = {
				templateUrl: 'static/partials/robot/interface.html',
				restrict: 'E',
				scope: {
		            connected: "=",
		            robot: "=",
		        },
		        controller: function($scope) {
	    			$scope.proxyObjectResolver = proxyObjectResolver;
	    			$scope.robots = Robot.query();
	    			$scope.connected = false;
	    						
	    			$scope.connect = function(robot) {
	    				$scope.connected = true;
	    			}
	    			
	    			$scope.disconnect = function(robot) {
	    				$scope.connected = false;
	    			}
    			}
  	  };

	  return def;
  }])
  .directive('advancedPoseEditor', ['$q', '$filter', 'proxyObjectResolver', 'JointPosition', 'RobotInterface', 'ServoInterface', function($q, $filter, proxyObjectResolver, JointPosition, RobotInterface, ServoInterface) {
	  var def = {
			  templateUrl: 'static/partials/action/poseadvanced.html',
			  restrict: 'E',
			  scope: {
				  pose: "=",
				  robot: "=",
				  connected: "=",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
				  
				  $scope.$watch('pose', function() {
					  if($scope.pose != undefined) {
						  proxyObjectResolver.resolveProp($scope.pose, 'jointPositions');
						  $scope.pose.jointPositions.then(function(result) {
							 $scope.groups = $scope.getGroups(result, $scope.robot);
						  });
					  }
				  });
			  
				  $scope.cometGet = function(data) {
					  $scope.servoPositions = data;
					  RobotInterface.get({'id': $scope.robot.id, 'timestamp':data.timestamp}, $scope.cometGet);
				  }

				  $scope.$watch('robot', function() {
					  if($scope.robot != undefined) {
						  proxyObjectResolver.resolveProp($scope.robot, 'servos');
						  $scope.robot.servos.then(function(result) {
							 $scope.joints = [];
							 for (var index in result) {
								 $scope.joints.push(result[index].jointName);
							 }
						  });
					  }

					  $scope.groups = $scope.getGroups($scope.pose.jointPositions, $scope.robot);
				  });
				  
				  $scope.getJointNames = function(servos) {
					  var names = [];
					  var keys = {}
					  if(servos != undefined) {
						  for(var i = 0; i < servos.length; i++) {
							  if(!keys.hasOwnProperty(servos[i].jointName)) {
								  names.push(servos[i].jointName);
								  names[servos[i].jointName] = 1;
							  }
						  }
					  }
					  
					  return names;
				  };
				  
				  $scope.getInteface = function(jointName) {
					  if($scope.robot != undefined && $scope.connected) {
						 for (var index in $scope.robot.servos) {
							 if($scope.robot.servos[index].jointName == jointName) {
								 return ServoInterface({'id': $scope.servo.id});
							 }
						 }
					  }
						 
					 return null;
				  }
				  
				  var processGroup = function(servoGroup, positions, groups){
					  proxyObjectResolver.resolveProp(servoGroup, 'servos');
					  return $q.when(servoGroup.servos).then(function(servos) {
						  var joints = [];
						  for (var servoIndex in servos) {
							  var servo = servos[servoIndex];
							  var found = false;
							  for (var posIndex in positions) {
								  if (positions[posIndex].jointName == servo.jointName) {
									  found = true;
									  joints.push(positions[posIndex]);
									  break;
								  }
							  }
							  
							  if (!found) {
								  joints.push(new JointPosition({
									  'angle':servo.defaultAngle, 
									  'speed': servo.defaultSpeed, 
									  'jointName':servo.jointName, 
									  'unused': true, 
									  'pose': $scope.pose
									  }));
							  }
						  }
						  
						  if(joints.length > 0) {
							  groups.push({'name': servoGroup.name, 'rows': getRows(joints)});
						  }
					  });
				  }
				  
				  $scope.getGroups = function(jointPositions, robot) {
					  if(jointPositions != undefined) {
						  return $q.when(jointPositions).then(function(positions) {
							  var groups = [];
							  if (robot == undefined) {
								  return [{'name':'Pose Joints', 'rows': getRows(positions)}];
							  } else {
								  proxyObjectResolver.resolveProp(robot, 'servoGroups');
								  return robot.servoGroups.then(function(servoGroups) {
									  var promises = [];
									  var groups = [];
									  for(var groupIndex in servoGroups) {
										  promises.push(processGroup(servoGroups[groupIndex], positions, groups));
									  }
									  
									  return $q.all(promises).then(function(res) {
										  return groups;
									  });
								  });
							  }
						  });
					  }
				  };
											  
				  var getRows = function(positions) {
					  var rows = [];
					  var posIndex = 0;
					  while (posIndex < positions.length) {
						  var row = [];
						  row.push(positions[posIndex]);
						  if (posIndex + 1 < positions.length) {
							  row.push(positions[posIndex + 1]);
						  }
						  if (posIndex + 2 < positions.length) {
							  row.push(positions[posIndex + 2]);
						  }
						  rows.push(row);
						  posIndex += 3;
					  }
					  return rows;
				  }
				  
				  $scope.getServo = function(jointName, servos) {
					  if (servos != undefined) {
						  var servo = null;
						  for (var i = 0; i < servos.length; i++) {
							  if(servos[i].jointName == jointName) {
								  servo = servos[i];
								  break;
							  }
						  }
						  
						  return servo;
					  }
				  }
				  
				  $scope.getPosition = function(jointName, positions) {
					  if(positions != undefined) {
						  var position = null;
						  for(var i = 0; i < positions.length; i++) {
							  if(positions[i].jointName == jointName) {
								  position = positions[i];
								  break;
							  }
						  }
						  
						  return position;
					  }
				  };
			  },
	  };
	  
	  return def;
  }])
  .directive('jointEditor', [ 'proxyObjectResolver', 'ServoInterface', function(proxyObjectResolver) {
	  var def = {
		  templateUrl: 'static/partials/action/joint.html',
		  restrict: 'E',
		  scope: {
			  jointNames: "=",
			  jointPosition: "=",
			  servo: "=",
			  servoPositions: "=",
			  connected: "=",
		  },
		  controller: function($scope) {
			  $scope.proxyObjectResolver = proxyObjectResolver;
			  
			  var servoInt = null;
			  var getInt = function() {
				  if (servoInt == null) {
					  servoInt = new ServoInterface({'id': $scope.servo.id });
				  }
			  }
			  
			  $scope.$watch('connected', function(value) {
				  if(value) {
					  $scope.writeToServo();
				  }
			  });
			  
			  $scope.writeToServo = function() {
				  if($scope.jointPosition != undefined) {
					  var servoInt = getInt();						  
					  servoInt.position = $scope.jointForm.jointangle;
					  servoInt.speed = $scope.jointForm.jointspeed;
					  servoInt.$save();
				  }
			  }
			  
			  $scope.$watch('jointPosition.angle', function() {
				  if($scope.connected) {
					  $scope.writeToServo();
				  }
			  });
		  },
	  };
	  
	  return def;
  }])
  .directive('soundEditor', [ 'proxyObjectResolver', function(proxyObjectResolver) {
	  var def = {
			  templateUrl: 'static/partials/action/sound.html',
			  restrict: 'E',
			  scope: {
				  sound: "=action",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
			  },
	  };
	  
	  return def;
  }])  
  .directive('groupEditor', [ 'proxyObjectResolver', function(proxyObjectResolver) {
	  var def = {
			  templateUrl: 'static/partials/action/group.html',
			  restrict: 'E',
			  scope: {
				  group: "=action",
				  actions: "=",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
				  
				  $scope.addActions = function(actions) {
					  if($scope.group.actions === undefined) {
						  $scope.group.actions = []
					  }

					  for (var i = 0; i < actions.length; i++) {
						  $scope.group.actions.push(actions[i]);
					  }
				  };
				  
				  $scope.removeActions = function(actions) {
					  for (var i = 0; i < actions.length; i++) {
						  $scope.group.actions.splice($scope.group.actions.indexOf(actions[i]), 1);
					  }
				  };
			  },
	  };
	  
	  return def;
  }])
  .directive('sequenceEditor', [ 'proxyObjectResolver', 'OrderedAction', function(proxyObjectResolver, OrderedAction) {
	  var def = {
			  templateUrl: 'static/partials/action/sequence.html',
			  restrict: 'E',
			  scope: {
				  sequence: "=action",
				  actions: "=",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
				  
				  $scope.addActions = function(actions) {
					  if($scope.sequence.ordered_actions === undefined) {
						  $scope.sequence.ordered_actions = []
					  }

					  for (var i = 0; i < actions.length; i++) {
						  var oa = new OrderedAction();
						  oa.order = $scope.sequence.ordered_actions.length;
						  oa.action = actions[i];
						  $scope.sequence.ordered_actions.push(oa);
					  }
				  };
				  
				  $scope.removeActions = function(actions) {
					  for (var i = 0; i < actions.length; i++) {
						  for(var j = 0; j < $scope.sequence.ordered_actions.length; j++) {
							  if($scope.sequence.ordered_actions[j].action == actions[i]) {
								  $scope.sequence.ordered_actions.splice(j, 1);
							  }
						  }
					  }
				  };
				  
				  $scope.getActions = function(ordered_actions) {
					  var ret = [];
					  if(ordered_actions != undefined) {
						  for(var i = 0; i < ordered_actions.length; i++) {
							  ret.push(ordered_actions[i].action);
						  }
					  }
					  return ret;
				  }
			  },
	  };
	  
	  return def;
  }])  
  .directive('triggerEditor', ['$compile', function($compile) {
		var def = {
				restrict: 'E',
				scope: {
					type: "=",
		            trigger: "=",
		            actions: "=",
		        },
		        link: function(scope, iElement, iAttrs, controller) {
		        	scope.$watch('type', function(newType) {
		        		if (newType != "" && newType != undefined) {
		        			iElement.html('<' + newType + '-trigger-editor trigger="trigger" actions="actions"></' + newType + '-editor>');
				        	$compile(iElement.contents())(scope);
		        		} else {
		        			iElement.html('');
		        			$compile(iElement.contents())(scope);
		        		}
		        	});
		        },
			  };

	return def;
  }])
  .directive('buttonTriggerEditor', [ 'proxyObjectResolver', function(proxyObjectResolver) {
	  var def = {
			  templateUrl: 'static/partials/trigger/button.html',
			  restrict: 'E',
			  scope: {
				  button: "=trigger",
				  actions: "=",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
				  
				  $scope.updateKey = function($event) {
					  var code = $event.which || $event.keyCode; // Not-IE || IE
					  var key = "";
					  if ($event.altKey) {
						  key += " + alt";
					  }
					  
					  if ($event.ctrlKey) {
						  key += " + ctrl";
					  }
					  
					  if ($event.shiftKey) {
						  key += " + shift";
					  }
					  
					  var disp = $scope.getDisplay(code);
					  if (disp != "" || key != "") {
						  if(disp != "") { 
							  key += " + " + disp;
						  }
						  $scope.key = key.slice(3);
						  $event.preventDefault();
					  }
				  };
				  
				  $scope.getDisplay = function(charCode) {
					  //http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
					  var char;
					  if (charCode == 8) char = "backspace";
					  else if (charCode == 9) char = ""; //tab
					  else if (charCode == 13) char = "enter";
					  else if (charCode == 16) char = ""; // shift
					  else if (charCode == 17) char = ""; // ctrl
					  else if (charCode == 18) char = ""; // alt
					  else if (charCode == 19) char = "pause/break";
					  else if (charCode == 20) char = ""; // caps
					  else if (charCode == 27) char = "escape";
					  else if (charCode == 32) char = "space";
					  else if (charCode == 33) char = "pageUp";
					  else if (charCode == 34) char = "pageDown";
					  else if (charCode == 35) char = "end";
					  else if (charCode == 36) char = "home";
					  else if (charCode == 37) char = "left";
					  else if (charCode == 38) char = "up";
					  else if (charCode == 39) char = "right";
					  else if (charCode == 40) char = "down";
					  else if (charCode == 45) char = "insert";
					  else if (charCode == 46) char = "delete";
					  else if (charCode == 91) char = ""; // left win
					  else if (charCode == 92) char = ""; // right win
					  else if (charCode == 93) char = ""; // select
					  else if (charCode == 96) char = "num0";
					  else if (charCode == 97) char = "num1";
					  else if (charCode == 98) char = "num2";
					  else if (charCode == 99) char = "num3";
					  else if (charCode == 100) char = "num4";
					  else if (charCode == 101) char = "num5";
					  else if (charCode == 102) char = "num6";
					  else if (charCode == 103) char = "num7";
					  else if (charCode == 104) char = "num8";
					  else if (charCode == 105) char = "num9";
					  else if (charCode == 106) char = "num*";
					  else if (charCode == 107) char = "num+";
					  else if (charCode == 109) char = "num-";
					  else if (charCode == 110) char = "num.";
					  else if (charCode == 111) char = "num/";
					  else if (charCode == 112) char = "F1";
					  else if (charCode == 113) char = "F2";
					  else if (charCode == 114) char = "F3";
					  else if (charCode == 115) char = "F4";
					  else if (charCode == 116) char = "F5";
					  else if (charCode == 117) char = "F6";
					  else if (charCode == 118) char = "F7";
					  else if (charCode == 119) char = "F8";
					  else if (charCode == 120) char = "F9";
					  else if (charCode == 121) char = "F10";
					  else if (charCode == 122) char = "F11";
					  else if (charCode == 123) char = "F12";
					  else if (charCode == 144) char = ""; // num lock
					  else if (charCode == 145) char = ""; // scroll lock
					  else if (charCode == 186) char = ";";
					  else if (charCode == 187) char = "=";
					  else if (charCode == 188) char = ",";
					  else if (charCode == 189) char = "-";
					  else if (charCode == 190) char = ".";
					  else if (charCode == 191) char = "/";
					  else if (charCode == 192) char = "`";
					  else if (charCode == 219) char = "[";
					  else if (charCode == 220) char = "\\";
					  else if (charCode == 221) char = "]";
					  else if (charCode == 222) char = "'";
					  else char = String.fromCharCode(charCode);
					  return char;
				  }
			  },
	  };
	  
	  return def;
  }])
  .directive('timeTriggerEditor', [ 'proxyObjectResolver', function(proxyObjectResolver) {
	  var def = {
			  templateUrl: 'static/partials/trigger/time.html',
			  restrict: 'E',
			  scope: {
				  time: "=trigger",
				  actions: "=",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
			  },
	  };
	  
	  return def;
  }])
  .directive('sensorTriggerEditor', [ 'proxyObjectResolver', function(proxyObjectResolver) {
	  var def = {
			  templateUrl: 'static/partials/trigger/sensor.html',
			  restrict: 'E',
			  scope: {
				  sensor: "=trigger",
				  actions: "=",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
			  },
	  };
	  
	  return def;
  }])
;
