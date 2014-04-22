'use strict';

define(function(require) {
	var Sensor = function() {
		return {
			id : null,
			name : null,
			value : null,
		}
	};

	var Servo = function() {
		return {
			id : null,
			actual : {
				position : null,
				poseable : null
			},
			poseable : null,
			position : null,
			jointName : null,
		}
	};

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
			for ( var servoName in newValue) {
				var servo = newValue[servoName];
				if (oldValue === undefined || oldValue[servoName] === undefined || servo.position != oldValue[servoName].position
						|| servo.poseable != oldValue[servoName].poseable) {
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
				if (components.servos[servo.jointName] == undefined) {
					components.servos[servo.jointName] = new Servo();
					components.servos[servo.jointName].jointName = servo.jointName;
				}

				components.servos[servo.jointName].id = servo.id;
				components.servos[servo.jointName].actual.position = servo.position;
				components.servos[servo.jointName].actual.poseable = servo.poseable;
			}

			for (var i = 0; i < dataPackage.sensors.length; i++) {
				var sensor = dataPackage.sensors[i];
				if (components.sensors[sensor.name] == undefined) {
					components.sensors[sensor.name] = new Sensor();
					components.sensors[sensor.name].name = sensor.name;
				}

				components.sensors[sensor.name].id = sensor.id;
				components.sensors[sensor.name].value = sensor.value;
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

		this.getSensor = function(sensorName) {
			if (sensorName === undefined) { return null; }

			if (components.sensors[sensorName] === undefined) {
				components.sensors[sensorName] = new Sensor();
				components.sensors[sensorName].name = sensorName;
			}

			return components.sensors[sensorName];
		}

		this.getServo = function(componentName) {
			if (componentName === undefined) { return null; }

			if (components.servos[componentName] == undefined) {
				components.servos[componentName] = new Servo();
				components.servos[componentName].jointName = componentName;
			}

			return components.servos[componentName];
		}
	};

	return [ '$q', '$timeout', '$rootScope', 'RobotInterface', RobotInterface ];
});
