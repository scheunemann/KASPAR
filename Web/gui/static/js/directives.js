'use strict';

/* Directives */
angular.module('kasparGUI.directives', [ 'proxyService', 'dataModels', 'kasparGUI.filters']).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('saveable', ['$compile', function($compile) {
	  var def = {
		restrict : 'A',
		require : 'ngModel',
		scope : {
			item : "=saveable",
		},
		link: function(scope, iElement, iAttrs, controller) {
			scope.modelCtrl = controller;
			
			scope.$watch('item', function(value) {
    			angular.element(iElement[0].parentElement).removeClass('has-success');
			});
			
			scope.$watch('modelCtrl.$dirty', function(value) {
				if(value) {
        			angular.element(iElement[0].parentElement).addClass('has-warning');
				} else {
        			angular.element(iElement[0].parentElement).removeClass('has-warning');
				}
			});
					
			scope.$watch('modelCtrl.$valid', function(value) {
				if (value) {
        			angular.element(iElement[0].parentElement).removeClass('has-error');
				} else {
        			angular.element(iElement[0].parentElement).addClass('has-error');
				}
			});

			scope.$watch('modelCtrl.$pristine', function(value) {
				if (!value) {
        			angular.element(iElement[0].parentElement).removeClass('has-success');
				}
			});
			
			scope.updateObj = function() {
				if (controller.$dirty) {
					scope.item.$save(function() {
						controller.$setPristine();
	        			angular.element(iElement[0].parentElement).addClass('has-success');
					});
				}
			};
			
			iElement.on('blur', function() {
				scope.updateObj();
			});
			
			iElement.on('keyup', function($event) {
				var code = $event.which || $event.keyCode; // Not-IE || IE
				if (code == 13) { // enter key
					scope.updateObj();
				}
			});
        },
		controller : function($scope) {
			$scope.newObj = function(type, list) {
				var newO = new type();
				if (list != undefined) {
					list.push(newO);
				}
				return newO;
			};

			$scope.deleteObj = function(item, list) {
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
		        	$scope.pose.positions = [
		        			new JointPosition({jointName:'HEAD_ROT', angle:188, speed:100}),
		        			new JointPosition({jointName:'HEAD_VERT', angle:188}),
		        			new JointPosition({jointName:'HEAD_TLT', angle:188}),
		        			new JointPosition({jointName:'EYES_LR', angle:188}),
		        			new JointPosition({jointName:'EYES_UD', angle:188}),
		        			new JointPosition({jointName:'MOUTH_OPEN', angle:188, speed:200}),
		        			new JointPosition({jointName:'MOUTH_SMILE', angle:188}),
		        			new JointPosition({jointName:'EYELIDS', angle:188}),
		        			new JointPosition({jointName:'ARM_L_1', angle:188}),
		        			new JointPosition({jointName:'ARM_L_2', angle:188}),
		        			new JointPosition({jointName:'ARM_L_3', angle:188}),
		        			new JointPosition({jointName:'ARM_L_4', angle:188}),
		        			new JointPosition({jointName:'ARM_R_1', angle:188}),
		        			new JointPosition({jointName:'ARM_R_2', angle:188}),
		        			new JointPosition({jointName:'ARM_R_3', angle:188}),
		        			new JointPosition({jointName:'ARM_R_4', angle:188}),
		        	];
		        }
  	  };

	  return def;
  }])
  .directive('advancedPoseEditor', ['$q', '$filter', 'proxyObjectResolver', 'JointPosition', 'RobotInterface', function($q, $filter, proxyObjectResolver, JointPosition, RobotInterface) {
	  var def = {
			  templateUrl: 'static/partials/action/poseadvanced.html',
			  restrict: 'E',
			  scope: {
				  pose: "=",
				  robot: "=",
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
				  $scope.joints = ['HEAD_ROT','HEAD_VERT', 'HEAD_TLT', 'EYES_LR', 'EYES_UD', 'MOUTH_OPEN', 'MOUTH_SMILE',
				                   'EYELIDS', 'ARM_L_1', 'ARM_L_2', 'ARM_L_3', 'ARM_L_4', 'ARM_R_1', 'ARM_R_2', 'ARM_R_3', 'ARM_R_4'];
			  
				  $scope.cometGet = function(data) {
					  $scope.servoPositions = data;
					  RobotInterface.get({'id': $scope.robot.id, 'timestamp':data.timestamp}, $scope.cometGet);
				  }

				  $scope.$watch('robot', function() {
					  if($scope.robot != undefined) {
						  //$scope.servoPositions = RobotInterface.get({'id': $scope.robot.id}, $scope.cometGet);
					  }
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
				  
				  $scope.getPosition = function(positions, servo) {
					  if(positions != undefined) {
						  var position = null;
						  for(var i = 0; i < positions.length; i++) {
							  if(positions[i].jointName == servo.jointName) {
								  position = positions[i];
								  break;
							  }
						  }
						  
						  if(position == null) {
							  position = new JointPosition({jointName:servo.jointName, angle:100});
							  positions.push(position);
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
			  },
			  controller: function($scope) {
				  $scope.proxyObjectResolver = proxyObjectResolver;
				  $scope.cometPost = function() {
					  if($scope.jointPosition.angle != undefined) {
						  var servo = ServoInterface.get({'id': $scope.servo.id}, function() {
							  servo.position = $scope.jointPosition.angle;
							  servo.speed = $scope.jointPosition.speed != undefined ? $scope.jointPosition.speed : ($scope.servo.defaultSpeed !=
									undefined ? $scope.servo.defaultSpeed : $scope.servo.model.defaultSpeed);
							  servo.$save({'id': $scope.servo.id});
						  });
					  }
				  }
				  
//				  $scope.$watch('servoPositions', function() {
//					  if ($scope.servoPositions != undefined && $scope.servoPositions.servos != undefined) {
//						  for(var i = 0; i < $scope.servoPositions.servos.length; i++) {
//							  if($scope.servoPositions.servos[i].id == $scope.servo.id) {
//								  $scope.position = $scope.servoPositions.servos[i].position;
//							  }
//						  }
//					  }
//				  });
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
