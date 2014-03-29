'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./advancedPoseEditor.tpl.html');
	require('actions/models');
	require('common/services/proxyServices');
	require('common/filters');
	require('robots/directives');

	var AdvancedPoseEditor = function($q, $rootScope, $filter, proxyObjectResolver, JointPosition, RobotInterface) {
		return {
			template : template,
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
						for ( var index in jointPositions) {
							posCopy.push(jointPositions[index]);
						}

						var groups = [];
						var def = $q.defer();
						if (robot == undefined) {
							$scope.groups = [ {
								'name' : 'Pose Joints',
								'rows' : posCopy
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
											'rows' : posCopy
										});
									}

									$scope.groups = groups;
									$rootScope.$$phase || $rootScope.$apply();
								});
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

	return [ '$q', '$rootScope', '$filter', 'proxyObjectResolver', 'JointPosition', 'RobotInterface', AdvancedPoseEditor ];
});
