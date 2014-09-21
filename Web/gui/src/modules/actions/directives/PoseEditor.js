'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./poseEditor.tpl.html');
	var _ = require('underscore');
	require('actions/models');
	require('robots/directives');

	var PoseEditor = function(JointPosition, RobotInterface, Action, language) {
		return {
			template : template,
			restrict : 'E',
			scope : {
				pose : "=action",
			},
			controller : function($scope) {
				$scope.language = language.getText();
				$scope.advanced = !$scope.connected;
				$scope.advancedopen = true;
				$scope.basicopen = false;

				$scope.$watch('pose', function(pose) {
					if (pose !== undefined && pose.speedModifier === undefined) {
						pose.speedModifier = 100;
					}
				});

				if ($scope.advanced === undefined) {
					$scope.advanced = !($scope.connected || false);
				}

				$scope.$watch('pose.jointPositions', function(jointPositions) {
					$scope.getGroups(jointPositions, $scope.robot);
				});

				$scope.$watch('robot.servos', function(servos) {
					servos = servos || [];
					$scope.joints = _.pluck(servos, 'jointName');

					if ($scope.pose !== undefined) {
						$scope.getGroups($scope.pose.jointPositions, $scope.robot);
					}
				});

				var processGroup = function(servoGroup, positions) {
					var joints = [];
					for ( var servoIndex in servoGroup.servos) {
						var servo = servoGroup.servos[servoIndex];
						var joint = _.find(positions, function(p) {
							return p.jointName == servo.jointName;
						});

						joints.push(joint || new JointPosition({
							'position' : servo.defaultPosition,
							'speed' : servo.defaultSpeed,
							'jointName' : servo.jointName,
							'pose_id' : $scope.pose.id
						}));
					}

					if (joints) {
						return {
							'name' : servoGroup.name,
							'rows' : joints,
							'poseable' : false,
						};
					}

					return null;
				};

				$scope.getGroups = function(jointPositions, robot) {
					jointPositions = jointPositions || [];
					var groups = [];
					if (robot) {
						robot.$getProperty('servoGroups').$promise.then(function(servoGroups) {
							var groups = _.map(servoGroups, function(sg) {
								return processGroup(sg, jointPositions);
							});

							var other = _.difference(jointPositions, _.flatten(_.map(groups, function(g) { return g.rows;}), true));
							if (other) {
								groups.push({
									'name' : 'No Group',
									'rows' : other,
									'poseable' : false,
								});
							}

							$scope.groups = groups;
						});
					} else {
						$scope.groups = [ {
							'name' : 'Pose Joints',
							'rows' : jointPositions.slice(0),
							'poseable' : false,
						} ];
					}
				};

				$scope.getServo = function(jointName, servos) {
					return _.find(servos, function(s) {
						return s.jointName == jointName;
					});
				};

				$scope.getPosition = function(jointName, positions) {
					return _.find(positions, function(p) {
						return p.jointName == jointName;
					});
				};

				$scope.save = function() {
					var toRemove = _.filter($scope.pose.jointPositions, function(p) {
						return p.isDeleted || p.id === undefined && !p.isNew;
					});

					var allJoints =_.flatten(_.map($scope.groups, function(g) { return g.rows;}), true);
					var unAttached = _.difference(allJoints, $scope.pose.jointPositions);
					var isNew = _.filter(unAttached, function(p) {
						return p.isNew;
					});
					
					// Remove any unexpected properties so flask-restless doesn't throw a fit
					_.each(isNew, function(jp) {
						delete jp.isNew;
					});
					
					$scope.pose.jointPositions.splice.apply($scope.pose.jointPositions, [$scope.pose.jointPositions.length, 0].concat(isNew));

					$scope.pose.jointPositions = _.difference($scope.pose.jointPositions, toRemove);
					$scope.pose.$save();
				};

				$scope.saveAs = function() {
					var positions = _.map($scope.pose.jointPositions, function(jp) {
						return new JointPosition({
							'position' : jp.position,
							'speed' : jp.speed,
							'jointName' : jp.jointName,
						});
					});

					var newPose = new Action({
						'type' : 'PoseAction',
						'name' : $scope.pose.name + ' - Copy',
						'speedModifier' : $scope.pose.speedModifier,
						'jointPositions' : positions
					});

					$scope.pose = newPose;
					$scope.save();
				};
			},
		};
	};

	return [ 'JointPosition', 'RobotInterface', 'Action', 'language', PoseEditor ];
});
