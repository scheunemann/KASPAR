'use strict';

define(function(require) {
	var RobotInterface = function($q, $timeout, $rootScope, RobotInterface) {
		var self = this;
		var connected = false;
		var robotId = null;
		var delayedSave = null;
		var saving = false;
		var components = {
			servos : {},
			sensors : {},
			id : null,
			timestamp : null,
		};

		var sendChanges = function(newValue, oldValue) {
			if (robotId == null || !connected) { return; }

			if (saving) {
				delayedSave = newValue;
				return;
			}

			var servos = [];
			for ( var servoName in newValue.servos) {
				var servo = newValue[servoName];
				var oldServo = oldValue[servoName];
				if (oldServo === undefined || servo.position != oldServo.position || servo.poseable != oldServo.poseable) {
					servos.push({
						id : servo.id,
						position : servo.position,
						poseable : servo.poseable,
						jointName : servoName,
					})
				}
			}

			if (servos.length > 0) {
				var packet = {
					servos : servos,
				}

				saving = true;
				var save = RobotInterface.save({
					id : robotId
				}, packet);
				save.$promise.then(function() {
					saving = false;
					if (delayedSave != null) {
						var ds = delayedSave;
						delayedSave = null;
						sendChanges(ds);
					}
				});
			} else {
				if (delayedSave != null) {
					var ds = delayedSave;
					delayedSave = null;
					sendChanges(ds);
				}

			}
		};

		var updateStatus = function(lastUpdateTime) {
			if (!connected) { return; }

			var status = lastUpdateTime == undefined ? RobotInterface.get({
				id : robotId
			}) : RobotInterface.get({
				id : robotId,
				timestamp : lastUpdateTime
			});
			status.$promise.then(processUpdate).then(updateStatus);
		};

		var processUpdate = function(dataPackage) {
			for (var i = 0; i < dataPackage.servos.length; i++) {
				var servo = dataPackage.servos[i];
				if (components.servos[servo.jointName] == undefined || components.servos[servo.jointName].id != servo.id) {
					components.servos[servo.jointName] = {
						id : servo.id,
					};
				}

				components.servos[servo.jointName].actual.position = servo.position;
				components.servos[servo.jointName].actual.poseable = servo.poseable;
			}

			for (var i = 0; i < dataPackage.sensors.length; i++) {
				var sensor = dataPackage.sensors[i];
				if (components.sensors[sensor.name] == undefined || components.sensors[sensor.name].id != sensor.id) {
					components.sensors[sensor.name] = {
						id : sensor.id,
					};
				}

				components.sensors[sensor.name].actual.value = sensor.value;
			}

			$rootScope.$$phase || $rootScope.$digest();
			return dataPackage.timestamp;
		}

		$rootScope.$watch(function() {
			return components.servos;
		}, sendChanges, true);

		this.setRobot = function(robot) {
			if (robot == undefined || robot == null && robotId != null) {
				this.setConnected(false);
				robotId = null;
				return;
			}

			if (robot.id != robotId) {
				var connected = this.connected;
				this.setConnected(false);
				robotId = robot.id;
				this.setConnected(connected);
			}
		};

		this.setConnected = function(connectedState) {
			connected = connectedState;
			if (connected) {
				updateStatus();
			}
		};

		this.getServo = function(componentName) {
			if (componentName === undefined) { return null; }

			if (components.servos[componentName] == undefined) {
				components.servos[componentName] = new function() {
				};
			}

			return components.servos[componentName];
		}
	};

	return [ '$q', '$timeout', '$rootScope', 'RobotInterface', RobotInterface ];
});
