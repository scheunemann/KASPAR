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

		var sendChanges = function(newValue) {
			if (robotId == null || !connected) { return; }

			if (saving) {
				delayedSave = components;
				return;
			}

			var servos = [];
			for ( var servoName in components.servos) {
				servos.push({
					id : components.servos[servoName].id,
					position : components.servos[servoName].position,
					poseable : components.servos[servoName].poseable,
					jointName : servoName,
				});
			}

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
		};

		var updateStatus = function(lastUpdateTime) {
			if(!connected) {
				return;
			}
			
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

				components.servos[servo.jointName].position = servo.position;
				components.servos[servo.jointName].poseable = servo.poseable;
			}

			for (var i = 0; i < dataPackage.sensors.length; i++) {
				var sensor = dataPackage.sensors[i];
				if (components.sensors[sensor.name] == undefined || components.sensors[sensor.name].id != sensor.id) {
					components.sensors[sensor.name] = {
						id : sensor.id,
					};
				}

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
