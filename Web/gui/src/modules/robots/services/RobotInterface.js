'use strict';

define(function(require) {
	var angular = require('angular');

	var RobotInterface = function($q, $timeout, RobotInterface) {
		this.connected = false;
		this.updateRate = 10;
		this.robotInterface = RobotInterface();
		this.components = {};
		
		this.updateStatus(robotInterface){
			
		}
		
		this.getStatus(componentPath) {
			//return the queried component at a promise object
			//cache the value for updates later
		}
	};

	return [ '$q', '$timeout', 'RobotInterface', RobotInterface ];
});
