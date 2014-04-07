'use strict';

define(function(require) {
	var angular = require('angular');

	var RobotInterface = function($q, $timeout, RobotInterface) {
		this.connected = false;
		this.robotId = null;
		this.components = {};
		
		this.setRobot = function(robot) {
			if(robot == undefined || robot == null && this.robotId != null) {
				this.setConnected(false);
				this.robotId = null;
			}
			
			if(robot.id != this.robotId) {
				var connected = this.connected;
				this.setConnected(false);
				this.robotId = robot.id;
				this.robotInterface.$promise.then(function() {
					this.setConnected(connected);
				});
			}
		}
		
		this.setConnected = function(connected) {
			this.connected = connected;
			if(this.connected) {
				this.updateStatus();
			}
		}
		
		var updateStatus = function(lastUpdateTime){
			var status = this.lastUpdateTime == undefined ? 
					RobotInterface.$get({id: this.robotId}) : 
					RobotInterface.$get({id: this.robotId, lastUpdate: lastUpdateTime});
			status.$promise.then(processUpdate).then(updateStatus);
		}
		
		var processUpdate(dataPackage) {
			
		}
		
		this.getComponent(componentName) {
			// return the queried component at a promise object
			// cache the value for updates later
		}
	};

	return [ '$q', '$timeout', 'RobotInterface', RobotInterface ];
});
