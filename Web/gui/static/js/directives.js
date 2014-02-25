'use strict';

/* Directives */
angular.module('kasparGUI.directives', [ 'proxyService', 'dataModels', 'kasparGUI.filters', 'displayService' 
] ).directive('model', [ function() {
	return {
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
} ]).directive('saveable', [ '$compile', '$timeout', function($compile, $timeout) {
	return {
		restrict : 'A',
		require : [ 'ngModel', '^form', '^model' ],
		link : function(scope, element, attrs, controllers) {
			var name = controllers[1].$name + "." + controllers[0].$name;
			var updateCalled = false;
			var parentElement = angular.element(element[0].parentElement);
			var modelCtrl = controllers[0];
			var saveCtrl = controllers[2];

			scope.$watch(name + '.$dirty', function(value) {
				if (value) {
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
//					uiMessages.transitionElement()
					parentElement.addClass('has-success');
					$timeout(function() {
						parentElement.removeClass('has-success');
					}, 2000)
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
} ]).directive('notEmpty', [ function() {
	return {
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
} ]).directive('robotEditor', [ 'RobotModel', function(RobotModel) {
	return {
		templateUrl : 'static/partials/robot/edit.html',
		restrict : 'E',
		scope : {
			robot : "=",
		},
		controller : function($scope) {
			$scope.models = RobotModel.query();

			$scope.viewJoints = function(robot) {
				$state.transitionTo('robot.view');
			};

			$scope.calibrateJoints = function(robot) {
				$state.transitionTo('robot.calibrate');
			};
		}
	};
} ]).directive('actionEditor', [ '$compile', function($compile) {
	return {
		restrict : 'E',
		scope : {
			type : "=",
			action : "=",
			actions : "=",
		},
		link : function(scope, iElement, iAttrs, controller) {
			scope.$watch('type', function(newType) {
				if (newType != "" && newType != undefined) {
					if (newType.toLowerCase() == "group" || newType.toLowerCase() == "sequence") {
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
} ]).directive('poseEditor', [ 'JointPosition', function(JointPosition) {
	return {
		templateUrl : 'static/partials/action/pose.html',
		restrict : 'E',
		scope : {
			pose : "=action",
		},
		controller : function($scope) {
		}
	};
} ]).directive('robotInterface', [ '$q', 'Robot', 'Setting', 'proxyObjectResolver', function($q, Robot, Setting, proxyObjectResolver) {
	return {
		templateUrl : 'static/partials/robot/interface.html',
		restrict : 'E',
		scope : {
			connected : "=",
			robot : "=",
		},
		controller : function($scope) {
			var settings = Setting.query({
				'key' : 'robot'
			});
			$scope.robots = Robot.query();
			$scope.connected = false;

			$q.all($scope.robots.$promise, settings.$promise).then(function() {
				if (settings.length > 0) {
					for (var i = 0; i < $scope.robots.length; i++) {
						if ($scope.robots[i].name == settings[0].value) {
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
} ]).directive(
		'advancedPoseEditor',
		[ '$q', '$rootScope', '$filter', 'proxyObjectResolver', 'JointPosition', 'RobotInterface', 'ServoInterface',
				function($q, $rootScope, $filter, proxyObjectResolver, JointPosition, RobotInterface, ServoInterface) {
					return {
						templateUrl : 'static/partials/action/poseadvanced.html',
						restrict : 'E',
						scope : {
							pose : "=",
							robot : "=",
							connected : "=",
						},
						controller : function($scope) {
							$scope.$watch('pose', function() {
								proxyObjectResolver.resolveProp($scope.pose, 'jointPositions', function(result) {
									$scope.getGroups(result, $scope.robot);
								});
							});

							$scope.cometGet = function(data) {
								$scope.servoPositions = data;
								RobotInterface.get({
									'id' : $scope.robot.id,
									'timestamp' : data.timestamp
								}, $scope.cometGet);
							}

							$scope.$watch('robot', function() {
								if ($scope.robot != undefined) {
									proxyObjectResolver.resolveProp($scope.robot, 'servos', function(servos) {
										$scope.joints = [];
										for (var i = 0; i < servos.length; i++) {
											$scope.joints.push(servos[i].jointName);
										}
									});
								}

								$scope.getGroups($scope.pose.jointPositions, $scope.robot);
							});

							$scope.getJointNames = function(servos) {
								var names = [];
								var keys = {}
								if (servos != undefined) {
									for (var i = 0; i < servos.length; i++) {
										if (!keys.hasOwnProperty(servos[i].jointName)) {
											names.push(servos[i].jointName);
											names[servos[i].jointName] = 1;
										}
									}
								}

								return names;
							};

							$scope.getInteface = function(jointName) {
								if ($scope.robot != undefined && $scope.connected) {
									for ( var index in $scope.robot.servos) {
										if ($scope.robot.servos[index].jointName == jointName) { return ServoInterface({
											'id' : $scope.servo.id
										}); }
									}
								}

								return null;
							};

							var processGroup = function(servoGroup, positions) {
								var def = $q.defer();
								proxyObjectResolver.resolveProp(servoGroup, 'servos', function(servos) {
									var joints = [];
									var ids = [];
									for ( var servoIndex in servos) {
										var servo = servos[servoIndex];
										var posId = null;
										for ( var posIndex in positions) {
											if (positions[posIndex].jointName == servo.jointName) {
												posId = positions[posIndex].id;
												joints.push(positions[posIndex]);
												break;
											}
										}

										if (posId == null) {
											joints.push(new JointPosition({
												'position' : servo.defaultPosition,
												'speed' : servo.defaultSpeed,
												'jointName' : servo.jointName,
												'unused' : true,
												'pose' : $scope.pose
											}));
										} else {
											ids.push(posId);
										}
									}

									var result = null;
									if (joints.length > 0) {
										result = [ ids, {
											'name' : servoGroup.name,
											'rows' : getRows(joints)
										} ];
									}

									def.resolve(result);
								});

								return def.promise;
							};

							$scope.getGroups = function(jointPositions, robot) {
								if (jointPositions != undefined) {
									var posCopy = [];
									for(var index in jointPositions) {
										posCopy.push(jointPositions[index]);
									}
									
									var groups = [];
									var def = $q.defer();
									if (robot == undefined) {
										$scope.groups = [ {
											'name' : 'Pose Joints',
											'rows' : getRows(posCopy)
										} ];
									} else {
										proxyObjectResolver.resolveProp(robot, 'servoGroups', function(servoGroups) {
											var promises = [];
											for (var index = 0; index < servoGroups.length; index++) {
												promises.push(processGroup(servoGroups[index], posCopy));
											}

											$q.all(promises).then(function(res) {
												var groups = [];
												for (var index = 0; index < res.length; index++) {
													if (res[index] != null) {
														groups.push(res[index][1]);
														for (var idIdx = 0; idIdx < res[index][0].length; idIdx++) {
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
													groups.push({
														'name' : 'No Group',
														'rows' : getRows(posCopy)
													});
												}

												$scope.groups = groups;
												$rootScope.$$phase || $rootScope.$apply();
											});
										});

									}
								}
							};

							var getRows = function(positions) {
								return positions;
								// var rows = [];
								// var posIndex = 0;
								// while (posIndex < positions.length) {
								// var row = [];
								// row.push(positions[posIndex]);
								// if (posIndex + 1 < positions.length) {
								// row.push(positions[posIndex + 1]);
								// }
								// if (posIndex + 2 < positions.length) {
								// row.push(positions[posIndex + 2]);
								// }
								// rows.push(row);
								// posIndex += 3;
								// }
								// return rows;
							}

							$scope.getServo = function(jointName, servos) {
								if (servos != undefined) {
									var servo = null;
									for (var i = 0; i < servos.length; i++) {
										if (servos[i].jointName == jointName) {
											servo = servos[i];
											break;
										}
									}

									return servo;
								}
							}

							$scope.getPosition = function(jointName, positions) {
								if (positions != undefined) {
									var position = null;
									for (var i = 0; i < positions.length; i++) {
										if (positions[i].jointName == jointName) {
											position = positions[i];
											break;
										}
									}

									return position;
								}
							};
						},
					};
				} ]).directive('jointEditor', [ 'proxyObjectResolver', 'ServoInterface', function(proxyObjectResolver, ServoInterface) {
	return {
		templateUrl : 'static/partials/action/joint.html',
		restrict : 'E',
		scope : {
			jointNames : "=",
			jointPosition : "=",
			servo : "=",
			servoPositions : "=",
			connected : "=",
		},
		controller : function($scope) {
			$scope.moving = false;

			$scope.$watch('servo', function(servo) {
				proxyObjectResolver.resolveProp(servo, 'model');
			});

			var servoInt = null;
			var getInt = function() {
				if (servoInt == null) {
					servoInt = new ServoInterface({
						'id' : $scope.servo.id
					});
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
				if (value) {
					$scope.writeToServo();
				}
			});

			$scope.coalesce = function() {
				for (var i = 0; i < arguments.length; i++) {
					if (arguments[i] != undefined && arguments[i] != null) { return arguments[i]; }
				}

				return null;
			}

			$scope.writeToServo = function() {
				if ($scope.jointPosition != undefined) {
					var servoInt = getInt();
					servoInt.position = $scope.coalesce($scope.jointPosition.position, $scope.servo.defaultPosition, $scope.servo.model.defaultPosition);
					servoInt.speed = $scope.coalesce($scope.jointPosition.speed, $scope.servo.defaultSpeed, $scope.servo.model.defaultSpeed);

					if (!$scope.moving) {
						servoInt.$save(function() {
							$scope.moving = false;
						}, function() {
							$scope.moving = false;
						});
					}
				}
			};

			$scope.$watch('jointPosition.position', function() {
				if ($scope.connected) {
					$scope.writeToServo();
				}
			});
		},
	};
} ]).directive('soundEditor', [ 'proxyObjectResolver', function(proxyObjectResolver) {
	return {
		templateUrl : 'static/partials/action/sound.html',
		restrict : 'E',
		scope : {
			sound : "=action",
		},
		controller : function($scope) {
		},
	};
} ]).directive('groupEditor', [ 'proxyObjectResolver', function(proxyObjectResolver) {
	return {
		templateUrl : 'static/partials/action/group.html',
		restrict : 'E',
		scope : {
			group : "=action",
			actions : "=",
		},
		controller : function($scope) {
			$scope.$watch('group', function(group) {
				proxyObjectResolver.resolveProp(group, 'actions');
			});

			$scope.addActions = function(actions) {
				if($scope.group.actions === undefined) {
					$scope.group.actions = [];
				}
				
				for (var i = 0; i < actions.length; i++) {
					$scope.group.actions.push(actions[i]);
				}
				
				$scope.group.$save();
			};

			$scope.removeActions = function(actions) {
				for (var i = 0; i < actions.length; i++) {
					$scope.group.actions.splice($scope.group.actions.indexOf(actions[i]), 1);
				}

				$scope.group.$save();
			};
		},
	};
} ]).directive('sequenceEditor', [ 'proxyObjectResolver', 'OrderedAction', function(proxyObjectResolver, OrderedAction) {
	return {
		templateUrl : 'static/partials/action/sequence.html',
		restrict : 'E',
		scope : {
			sequence : "=action",
			actions : "=",
		},
		controller : function($scope) {
			$scope.$watch('sequence', function(sequence) {
				proxyObjectResolver.resolveProp(sequence, 'ordered_actions', function(oactions) {
					if (oactions != undefined) {
						for (var i = 0; i < oactions.length; i++) {
							proxyObjectResolver.resolveProp(oactions[i], 'action');
						}
					}
				});
			});

			$scope.moveActions = function(oactions, change) {
				// Change == 1
				// oactions.length = 3
				// ordered_actions.lenght = 7
				// for action in oactions:
				//   order += change
				//   if exists(ordered_actions.order)
				//     ordered_actions.order -= change
				/*
				 * [3, 5, 6] +1
				 * 1 => 1
				 * 2 => 2
				 * 3 => 4 (+1)
				 * 4 => 3 (-1)
				 * 5 => 6 (+1)
				 * 6 => 7 (+1)
				 * 7 => 5 (-2)
				 * 
				 */				
				
				if (oactions != undefined && oactions.length > 0) {
					for(var i = 0; i < oactions.length; i++) {
						oactions[i].order += change;
						if (oactions[i].order < 0) {
							oactions[i].order = 0;
						}
						
						for(var j = 0; j < $scope.sequence.ordered_actions.length; j++) {
							var test = $scope.sequence.ordered_actions[j];
							if(test != oactions[i] && test.order == oactions[i].order){
								test.order -= change;
								break;
							}
						}
					}
					
					$scope.saveAll();
				}
			}
			
			$scope.saveAll = function() {
				//Collapse gaps and fix duplicates
				for(var i = 0; i < $scope.sequence.ordered_actions.length;) {
					var left = $scope.sequence.ordered_actions[i];
					var next = false;
					
					for(var j = 0; j < $scope.sequence.ordered_actions.length; j++) {
						var right = $scope.sequence.ordered_actions[j];
						if(left != right) {
							if(left.order == right.order) {
								right.order += 1
							} else if(left.order - 1 == right.order) {
								next = true;
							}
						}
					}
					
					if(next || left.order == 0) {
						i++;
					} else {
						left.order -= 1;
					}
				}
				
				$scope.sequence.$save();
				
//				
//				for(var i = 0; i < $scope.sequence.ordered_actions.length; i++) {
//					$scope.sequence.ordered_actions[i].$save();
//					proxyObjectResolver.resolveProp($scope.sequence.ordered_actions[i], 'action');
//				}
			}
			
			$scope.addActions = function(actions) {
				if ($scope.sequence.ordered_actions === undefined) {
					$scope.sequence.ordered_actions = []
				}

				for (var i = 0; i < actions.length; i++) {
					var oa = new OrderedAction();
					oa.order = oactions.length;
					oa.action = actions[i];
					$scope.sequence.ordered_actions[i].push(oa);
				}
				
				$scope.saveAll();
			};

			$scope.removeActions = function(oactions) {
				for (var i = 0; i < oactions.length; i++) {
					$scope.sequence.ordered_actions.splice($scope.sequence.ordered_actions.indexOf(oactions[i]), 1);
//					if (oactions[i].id != undefined) {
//						oactions[i].$delete();
//					}
				}
				
				$scope.saveAll();
			};

			$scope.getActions = function(ordered_actions) {
				var ret = [];
				if (ordered_actions != undefined) {
					for (var i = 0; i < ordered_actions.length; i++) {
						ret.push(ordered_actions[i].action);
					}
				}
				return ret;
			}
		},
	};
} ]).directive('triggerEditor', [ '$compile', function($compile) {
	return {
		restrict : 'E',
		scope : {
			type : "=",
			trigger : "=",
			triggers : "=",
			actions : "=",
		},
		link : function(scope, iElement, iAttrs, controller) {
			scope.$watch('type', function(newType) {
				if (newType != "" && newType != undefined) {
					iElement.html('<' + newType + '-trigger-editor trigger="trigger" triggers="triggers" actions="actions"></' + newType + '-editor>');
					$compile(iElement.contents())(scope);
				} else {
					iElement.html('');
					$compile(iElement.contents())(scope);
				}
			});
		},
	};
} ]).directive('buttonTriggerEditor', [ 'proxyObjectResolver', 'ButtonHotKey', function(proxyObjectResolver, ButtonHotKey) {
	return {
		templateUrl : 'static/partials/trigger/button.html',
		restrict : 'E',
		scope : {
			button : "=trigger",
			actions : "=",
			triggers: "=",
		},
		controller : function($scope) {
			$scope.$watch('button', function(button) {
				proxyObjectResolver.resolveProp(button, 'hotKeys');
			});

			$scope.addButton = function() {
				$scope.button.hotKeys.push(new ButtonHotKey({
					'trigger_id' : $scope.button.id
				}));
			}
		},
	};
} ]).directive('hotkeyEditor', [ 'proxyObjectResolver', 'hotkeyFormatter', function(proxyObjectResolver, hotkeyFormatter) {
	return {
		templateUrl : 'static/partials/trigger/hotkey.html',
		restrict : 'E',
		scope : {
			hotkey : "=",
			button : "=",
		},
		controller : function($scope) {
			$scope.deleteKey = function() {
				$scope.button.hotKeys.splice(keys.indexOf($scope.hotkey), 1);
				if ($scope.hotkey.id != undefined) {
					$scope.hotkey.$delete();
				}
			}

			$scope.updateKey = function($event, hotKey) {
				var code = $event.which || $event.keyCode; // Not-IE || IE
				var key = hotkeyFormatter.getDisplayFromEvent($event);
				if (key != "") {
					hotKey.keyString = key;
					$scope.hotkeyEditor.key.$dirty = true;
					$event.preventDefault();
				}
			};
		},
	};
} ]).directive('timeTriggerEditor', [ 'proxyObjectResolver', function(proxyObjectResolver) {
	return {
		templateUrl : 'static/partials/trigger/time.html',
		restrict : 'E',
		scope : {
			time : "=trigger",
			actions : "=",
			triggers : "=",
		},
		link : function(scope, iElement, iAttrs, controller) {
		},
		controller : function($scope) {
			$scope.$watch('time', function(time) {
				proxyObjectResolver.resolveProp(time, 'action');
				proxyObjectResolver.resolveProp(time, 'triggers', function() {
					if($scope.time.selfRef) {
						$scope.time.triggers.push($scope.time);
					}
				});
			});
						
			$scope.addTriggers = function(triggers) {
				if($scope.time.triggers === undefined) {
					$scope.time.triggers = [];
				}
				
				for (var i = 0; i < triggers.length; i++) {
					$scope.time.triggers.push(triggers[i]);
				}
				
				save();
			};
			
			var save = function() {
				var selfIndex = -1;
				if($scope.time.id !== undefined) {
					for(var i = 0; i < $scope.time.triggers.length; i++) {
						if($scope.time.triggers[i].id === $scope.time.id) {
							selfIndex = i;
							break;
						}
					}
				} else {
					selfIndex = $scope.time.triggers.indexOf($scope.time);
				}
				
				if (selfIndex >=0){
					$scope.time.triggers.splice(selfIndex, 1)
					$scope.time.selfRef = true;
					$scope.time.$save(function() {
						selfIndex = -1;
						for(var i = 0; i < $scope.time.triggers.length; i++) {
							if($scope.time.triggers[i].id === $scope.time.id) {
								selfIndex = i;
								break;
							}
						}
						if(selfIndex < 0) {
							$scope.time.triggers.push($scope.time);
						}
					});
				} else {
					$scope.time.$save();
				}
			}

			$scope.removeTriggers = function(triggers) {
				for (var i = 0; i < triggers.length; i++) {
					$scope.time.triggers.splice($scope.time.triggers.indexOf(triggers[i]), 1);
				}
				
				save();
			};
			
		},
	};
} ]).directive('sensorTriggerEditor', [ 'proxyObjectResolver', 'Sensor', function(proxyObjectResolver, Sensor) {
	return {
		templateUrl : 'static/partials/trigger/sensor.html',
		restrict : 'E',
		scope : {
			sensor : "=trigger",
			actions : "=",
		},
		link : function(scope, iElement, iAttrs, controller) {
		},
		controller : function($scope) {
			/*
			 *     id = Column(Integer, ForeignKey('%s.id' % 'Trigger'), primary_key=True)
			 *     sensorName = Column(String(50))
			 *     sensorValue = Column(String(50))  # >0, >=0, <0, <=0, ==0,=='abc'
 			 */
			$scope.$watch('sensor', function(sensor) {
				proxyObjectResolver.resolveProp(sensor, 'action');
			});
			
			$scope.$watch('selectedSensor', function(sensor) {
				if(sensor !== undefined) {
					$scope.sensor.sensorName = sensor.name;
				}
			});
			
			$scope.sensors = Sensor.query();
		},
	};
} ]).directive('sensorValueEditor', [ '$compile', function($compile) {
	return {
		restrict : 'E',
		scope : {
			type : "=",
			sensor: "=",
			value: "=",
		},
		link : function(scope, iElement, iAttrs, controller) {
			scope.$watch('type', function(newType) {
				if (newType != "" && newType != undefined) {
					if (newType.toLowerCase() == "group" || newType.toLowerCase() == "sequence") {
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
} ]).directive('operatorInteraction', [ function() {
	return {
		templateUrl : 'static/partials/interaction/operator.html',
		restrict : 'E',
		scope : {
			operator : "=",
			user : "=",
			interaction : "=",
			buttons : "=",
			showHotKeys : "=",
			keyBind : "=",
		},
		link : function(scope, element, attrs, controller) {
		},
		controller : function($scope) {
			$scope.isopen = true;

			$scope.setBinding = function(value) {
				// Reversed as this is called BEFORE updating keyBind
				if (!value) {
					Mousetrap.unpause();
				} else {
					Mousetrap.pause();
				}
			};
		},
	};
} ]).directive('userInteraction', [ function() {
	return {
		templateUrl : 'static/partials/interaction/user.html',
		restrict : 'E',
		scope : {
			user : "=",
			interaction : "=",
			buttons : "=",
			showHotKeys : "=",
			keyBind : "=",
		},
		link : function(scope, element, attrs, controller) {
		},
		controller : function($scope) {
		},
	};
} ]).directive('actionButton',
		[ '$q', '$timeout', 'proxyObjectResolver', 'UserAction', 'hotkeyFormatter', function($q, $timeout, proxyObjectResolver, UserAction, hotkeyFormatter) {
			return {
				templateUrl : 'static/partials/interaction/actionButton.html',
				restrict : 'E',
				scope : {
					button : "=",
					interaction : "=",
					showHotKeys : "=",
					keyBind : "=",
				},
				link : function(scope, element, attrs, controller) {
					scope.$watch('button', function(button) {
						if (button != undefined) {
							proxyObjectResolver.resolveProp(button, 'hotKeys', function(keys) {
								var kb = [];
								for (var i = 0; i < keys.length; i++) {
									kb.push(keys[i].keyString);
								}

								scope.keyDisplay = kb.join(' | ');

								Mousetrap.bind(kb, function() {
									scope.active = true;
									$timeout(function() {
										scope.active = false;
									}, 2000);
									if (scope.keyBind) {
										scope.callButton(scope.button.id);
										return false;
									}
								});
							});
						}
					});
				},
				controller : function($scope) {
					$scope.active = false;
					
					$scope.callButton = function(buttonId) {
						new UserAction({
							'trigger_id' : buttonId,
							'interaction_id' : $scope.interaction.id
						}).$save();
					}
				}
			};
} ]).directive('actionButtons',
	[ '$q', 'proxyObjectResolver', 'UserAction', 'hotkeyFormatter', function($q, proxyObjectResolver, UserAction, hotkeyFormatter) {
		return {
			templateUrl : 'static/partials/interaction/actionButtons.html',
			restrict : 'E',
			scope : {
				buttons : "=",
				user : "=",
				interaction : "=",
				showHotKeys : "=",
				keyBind : "=",
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
			},
		};
} ]).directive('keybinding', 
	[ '$timeout', function($timeout) {
		return {
			restrict : 'E',
			scope : {
				invoke : '&'
			},
			link : function(scope, element, attrs, controller) {
				if (attr.button) {
					Mousetrap.bind(attr.on, function() {
						scope.invoke();
						var elem = angular.element(el).parent().find(attr.button)
						if (elem) {
							elem.addClass('active');
							$timeout(elem.removeClass('active'), 2000);
						}
					});
				} else {
					Mousetrap.bind(attr.on, scope.invoke);
				}
			},
			controller : function($scope) {
			},
		};
} ]);
