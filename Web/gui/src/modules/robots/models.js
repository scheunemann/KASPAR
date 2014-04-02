'use strict';

define(function(require) {
	var angular = require('angular');
	var angularResource = require('angularResource');
	var Robot = require('./models/Robot');
	var RobotInterface = require('./models/RobotInterface');
	var RobotModel = require('./models/RobotModel');
	var Sensor = require('./models/Sensor');
	var SensorGroup = require('./models/SensorGroup');
	var SensorModel = require('./models/SensorModel');
	var SensorValueType = require('./models/SensorValueType');
	var Servo = require('./models/Servo');
	var ServoConfig = require('./models/ServoConfig');
	var ServoGroup = require('./models/ServoGroup');
	var ServoInterface = require('./models/ServoInterface');
	var ServoModel = require('./models/ServoModel');

	var moduleName = 'kasparGUI.robots.models';
	var dependancies = [
	                   	angularResource,
	                  ];
	
	var module = angular.module(moduleName, dependancies)
		.factory('Robot', Robot)
		.factory('RobotInterface', RobotInterface)
		.factory('RobotModel', RobotModel)
		.factory('Sensor', Sensor)
		.factory('SensorGroup', SensorGroup)
		.factory('SensorModel', SensorModel)
		.factory('Servo', Servo)
		.factory('ServoConfig', ServoConfig)
		.factory('ServoGroup', ServoGroup)
		.factory('SensorValueType', SensorValueType)
		.factory('ServoInterface', ServoInterface)
		.factory('ServoModel', ServoModel);

	return moduleName;
});
