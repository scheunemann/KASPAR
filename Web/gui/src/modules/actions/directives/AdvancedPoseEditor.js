'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./advancedPoseEditor.tpl.html');
	require('actions/models');
	require('common/filters');
	require('robots/directives');

	var AdvancedPoseEditor = function(JointPosition, RobotInterface) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				pose : "=",
				robot : "=",
				connected : "=",
			},
			controller : function($scope) {
				$scope.$watch('pose.jointPositions', function(jointPositions) {
					if (jointPositions != undefined) {
						$scope.getGroups(jointPositions, $scope.robot);
					}
				});

				$scope.cometGet = function(data) {
					// $scope.servoPositions = data;
					// RobotInterface.get({
					// 'id' : $scope.robot.id,
					// 'timestamp' : data.timestamp
					// }, $scope.cometGet);
				}

				$scope.$watch('robot.servos', function(servos) {
					if (servos != undefined) {
						$scope.joints = [];
						for (var i = 0; i < servos.length; i++) {
							$scope.joints.push(servos[i].jointName);
						}

						$scope.getGroups($scope.pose.jointPositions, $scope.robot);
					}
				});

				var processGroup = function(servoGroup, positions) {
					var joints = [];
					var ids = [];
					for (var servoIndex in servoGroup.servos) {
						var servo = servoGroup.servos[servoIndex];
						var posId = null;
						for ( var posIndex in positions) {
							if (positions[posIndex].jointName == servo.jointName) {
								posId = positions[posIndex].id;
								joints.push(positions[posIndex]);
								break;
							}
						}

						if (posId == null) {
							joints.push({
								'position' : servo.defaultPosition,
								'speed' : servo.defaultSpeed,
								'jointName' : servo.jointName,
								'unused' : true,
								'pose' : $scope.pose
							});
						} else {
							ids.push(posId);
						}
					}

					var result = null;
					if (joints.length > 0) {
						result = [ ids, {
							'name' : servoGroup.name,
							'rows' : joints
						} ];
					}

					return result;
				};

				$scope.getGroups = function(jointPositions, robot) {
					if (jointPositions != undefined) {
						var posCopy = [];
						for ( var index in jointPositions) {
							posCopy.push(jointPositions[index]);
						}

						var groups = [];
						if (robot == undefined) {
							$scope.groups = [ {
								'name' : 'Pose Joints',
								'rows' : posCopy
							} ];
						} else {
							robot.getProperty('servoGroups').$promise.then(function(servoGroups) {
								var res = []
								for (var index = 0; index < servoGroups.length; index++) {
									res.push(processGroup(servoGroups[index], posCopy));
								}

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
										'rows' : posCopy
									});
								}

								$scope.groups = groups;
							});
						}
					}
				};

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
	};

	return [ 'RobotInterface', AdvancedPoseEditor ];
});