'use strict';

/* Directives */
angular.module('kasparGUI.directives', [ 'proxyService', 'dataModels', 'kasparGUI.filters', 'displayService'])
.directive('appVersion', ['version', function(version) {
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
					$scope.models = RobotModel.query();
					
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
  .directive('robotInterface', ['$q', 'Robot', 'Setting', 'proxyObjectResolver', function($q, Robot, Setting, proxyObjectResolver) {
	  var def = {
				templateUrl: 'static/partials/robot/interface.html',
				restrict: 'E',
				scope: {
		            connected: "=",
		            robot: "=",
		        },
		        controller: function($scope) {		        	
	    			$scope.proxyObjectResolver = proxyObjectResolver;

	    			var settings = Setting.query({'key':'robot'});
	    			$scope.robots = Robot.query();
	    			$scope.connected = false;

	    			$q.all($scope.robots.$promise, settings.$promise).then(function() {
	    				if(settings.length > 0) {
    						for(var i = 0; i < $scope.robots.length; i++) {
    							if($scope.robots[i].name == settings[0].value) {
    								$scope.robot = $scope.robots[i];
    								$scope.configured = true;
    								break;
    							}
    						}
	    				}
	    			});
	    			
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
				  
				  var processGroup = function(servoGroup, positions){
					  proxyObjectResolver.resolveProp(servoGroup, 'servos');
					  return $q.when(servoGroup.servos).then(function(servos) {
						  var joints = [];
						  var ids = [];
						  for (var servoIndex in servos) {
							  var servo = servos[servoIndex];
							  var posId = null;
							  for (var posIndex in positions) {
								  if (positions[posIndex].jointName == servo.jointName) {
									  posId = positions[posIndex].id;
									  joints.push(positions[posIndex]);
									  break;
								  }
							  }
							  
							  if (posId == null) {
								  joints.push(new JointPosition({
									  'position':servo.defaultPosition, 
									  'speed': servo.defaultSpeed, 
									  'jointName':servo.jointName, 
									  'unused': true, 
									  'pose': $scope.pose
									  }));
							  } else {
								  ids.push(posId);
							  }
						  }
						  
						  if(joints.length > 0) {
							  return [ids, {'name': servoGroup.name, 'rows': getRows(joints)}];
						  } else {
							  return null;
						  }
					  });
				  }
				  
				  $scope.getGroups = function(jointPositions, robot) {
					  if(jointPositions != undefined) {
						  return $q.when(jointPositions).then(function(positions) {
							  var posCopy = positions.slice(0);
							  var groups = [];
							  if (robot == undefined) {
								  return [{'name':'Pose Joints', 'rows': getRows(posCopy)}];
							  } else {
								  proxyObjectResolver.resolveProp(robot, 'servoGroups');
								  return robot.servoGroups.then(function(servoGroups) {
									  var promises = [];
									  for(var groupIndex in servoGroups) {
										  promises.push(processGroup(servoGroups[groupIndex], posCopy));
									  }
									  
									  return $q.all(promises).then(function(res) {
										  var groups = [];
										  for (var index = 0; index < res.length; index++) {
											  if (res[index] != null) {
												  groups.push(res[index][1]);
												  for(var idIdx = 0; idIdx < res[index][0].length; idIdx++) {
													  for (var posIdx = 0; posIdx < posCopy.length; posIdx++) {
														  if (posCopy[posIdx].id == res[index][0][idIdx]) {
															  var elm = posCopy.splice(posIdx, 1);
															  break;
														  }
													  }
												  }
											  }
										  }
										  
										  if (posCopy.length > 0) {
											  groups.push({'name': 'No Group', 'rows': getRows(posCopy) });
										  }
										  
										  return groups;
									  });
								  });
							  }
						  });
					  }
				  };
											  
				  var getRows = function(positions) {
					  return positions;
//					  var rows = [];
//					  var posIndex = 0;
//					  while (posIndex < positions.length) {
//						  var row = [];
//						  row.push(positions[posIndex]);
//						  if (posIndex + 1 < positions.length) {
//							  row.push(positions[posIndex + 1]);
//						  }
//						  if (posIndex + 2 < positions.length) {
//							  row.push(positions[posIndex + 2]);
//						  }
//						  rows.push(row);
//						  posIndex += 3;
//					  }
//					  return rows;
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
  .directive('jointEditor', [ 'proxyObjectResolver', 'ServoInterface', function(proxyObjectResolver, ServoInterface) {
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
			  $scope.moving = false;
			  
			  var servoInt = null;
			  var getInt = function() {
				  if (servoInt == null) {
					  servoInt = new ServoInterface({'id': $scope.servo.id });
				  }
				  
				  return servoInt;
			  }
			  
			  $scope.removeJoint = function() {
				  $scope.jointPosition.$delete(function() {
					  $scope.jointPosition.unused = true;
					  delete $scope.jointPosition.id;
				  });
			  };
			  
			  $scope.$watch('connected', function(value) {
				  if(value) {
					  $scope.writeToServo();
				  }
			  });
			  
			  $scope.coalesce = function() {
				  for (var i=0; i < arguments.length; i++) {
					  if (arguments[i] != undefined && arguments[i] != null) {
						  return arguments[i];
					  }
				  }
				  
				  return null;
			  }
			  
			  $scope.writeToServo = function() {
				  if($scope.jointPosition != undefined) {
					  var servoInt = getInt();
					  servoInt.position = $scope.coalesce($scope.jointPosition.position, $scope.servo.defaultPosition, $scope.servo.model.defaultPosition);
					  servoInt.speed = $scope.coalesce($scope.jointPosition.speed, $scope.servo.defaultSpeed, $scope.servo.model.defaultSpeed);
					  
					  if (!$scope.moving) {
						  servoInt.$save(
								  function() { $scope.moving = false; },
								  function() { $scope.moving = false; }
						  );
					  }
				  }
			  };
			  
			  $scope.$watch('jointPosition.position', function() {
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
				  
				  $scope.$watch('sequence', function(sequence) {
					  if (sequence != undefined) {
						  proxyObjectResolver.resolveProp(sequence, 'ordered_actions', function(oactions) {
							  for (var i = 0; i < oactions.length; i++) {
								  proxyObjectResolver.resolveProp(oactions[i], 'action');
							  }
						  });
					  }
				  });
				  
				  $scope.addActions = function(actions) {
					  if($scope.sequence.ordered_actions === undefined) {
						  $scope.sequence.ordered_actions = []
					  }

					  for (var i = 0; i < actions.length; i++) {
						  (function(action) {
							  proxyObjectResolver.resolveProp($scope.sequence, 'ordered_actions', function(oactions) {
								  var oa = new OrderedAction();
								  oa.order = oactions.length;
								  oa.action = action;
								  oactions.push(oa);
							  });
						  })(actions[i]);
					  }
				  };
				  
				  $scope.removeActions = function(oactions) {
					  proxyObjectResolver.resolveProp($scope.sequence, 'ordered_actions', function(myoactions) {
						  for (var i = 0; i < oactions.length; i++) {
							  myoactions.splice(myoactions.indexOf(oactions[i]), 1);
							  if (oaction[i].id != undefined) {
								  oactions[i].$delete();
							  }
						  }
					  });
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
  .directive('buttonTriggerEditor', [ 'proxyObjectResolver', 'ButtonHotKey', function(proxyObjectResolver, ButtonHotKey) {
	  var def = {
			  templateUrl: 'static/partials/trigger/button.html',
			  restrict: 'E',
			  scope: {
				  button: "=trigger",
				  actions: "=",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
				  
				  $scope.addButton = function() {
					  proxyObjectResolver.resolveProp($scope.button, 'hotKeys', function(keys) {
						  keys.push(new ButtonHotKey({'trigger_id': $scope.button.id}));
					  });
				  }
			  },
	  };
	  
	  return def;
  }])
  .directive('hotkeyEditor', [ 'proxyObjectResolver', 'hotkeyFormatter', function(proxyObjectResolver, hotkeyFormatter) {
	  var def = {
			  templateUrl: 'static/partials/trigger/hotkey.html',
			  restrict: 'E',
			  scope: {
				  hotkey: "=",
				  button: "=",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
				  				  
				  $scope.$watch('hotkey.display', function(value) {
					  if(value == undefined || value == "") {
						  $scope.hotkey.display = hotkeyFormatter.getDisplay($scope.hotkey);
					  }
				  });
				  
				  $scope.deleteKey = function() {
					  proxyObjectResolver.resolveProp($scope.button, 'hotKeys', function(keys) {
						  	keys.splice(keys.indexOf($scope.hotkey), 1);
						  	if ($scope.hotkey.id != undefined) {
						  		$scope.hotkey.$delete();
						  	}
					  });
				  }
				  
				  $scope.updateKey = function($event, hotKey) {
					  var code = $event.which || $event.keyCode; // Not-IE || IE
					  var modifiers = ""
					  if ($event.altKey) {
						  modifiers += ", alt"
					  }
					  
					  if ($event.ctrlKey) {
						  modifiers += ", ctrl"
					  }
					  
					  if ($event.shiftKey) {
						  modifiers += ", shift"
					  }
					  
					  var disp = hotkeyFormatter.getCharDisplay(code);
					  if (disp != "" || modifiers != "") {
						  hotKey.modifiers = modifiers.slice(2)
						  hotKey.keyCode = code;
						  hotKey.display = hotkeyFormatter.getDisplay(hotKey);
						  $scope.hotkeyEditor.key.$dirty = true;
						  $event.preventDefault();
					  }
				  };
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
  .directive('operatorInteraction', [ 'proxyObjectResolver', function(proxyObjectResolver, Operator, Interaction) {
	  var def = {
			  templateUrl: 'static/partials/interaction/operator.html',
			  restrict: 'E',
			  scope: {
				  operator: "=",
				  interaction: "=",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
			  },
	  };
	  
	  return def;
  }])
  .directive('userInteraction', [ 'proxyObjectResolver', 'hotkeyFormatter', 'User', 'UserAction', 'Trigger', function(proxyObjectResolver, hotkeyFormatter, User, UserAction, Trigger) {
	  var def = {
			  templateUrl: 'static/partials/interaction/user.html',
			  restrict: 'E',
			  scope: {
				  user: "=",
				  interaction: "=",
			  },
			  link : function(scope, element, attrs, controller) {
				  var doc = angular.element(element[0].ownerDocument);
				  doc.on('keydown', function($event) {
					  scope.checkCallAction(hotkeyFormatter.getDisplayFromEvent($event));
					  $event.preventDefault();
				  });
			  },
			  controller: function($scope, $document) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
				  $scope.buttons = Trigger.query({'type': 'Button'}, function(results) {
					
				  });
				  
				  $scope.checkCallAction = function(keyDisplay) {
					  for (var btnIndex in $scope.buttons) {
						  proxyObjectResolver.resolveProp($scope.buttons[btnIndex], 'hotKeys', function(hotKeys) {
							  for (var hkIndex in hotKeys) {
								  var hk = hotKeys[hkIndex];
								  //TODO: This is a dumb way to handle this...
								  if(hotkeyFormatter.getDisplay(hk) == keyDisplay) {
									  $scope.newUserAction(hk.trigger_id);
									  break;
								  }
							  }
						  });
					  }
				  }
				  
				  $scope.getKeyDisplay = function(keys) {
					  if (keys != undefined) {
						  var disp = ""
						  for(var i = 0; i < keys.length; i++) {
							  disp += " | " + hotkeyFormatter.getDisplay(keys[i]);
						  }
						  
						  if (disp != "") {
							  disp = disp.substring(3);
						  }
						  
						  return disp;
					  }
				  };
				  
				  $scope.newUserAction = function(buttonId) {
					  var a = new UserAction({'button_id': buttonId, 'user_id': $scope.user.id, 'interaction_id': $scope.interaction.id});
					  a.$save();
				  };
			  },
	  };
	  
	  return def;
  }])
;
