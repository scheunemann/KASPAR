'use strict';

angular.module('dataModels', [ 'ngResource', 'ng' ])
	.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('proxyResourceInterceptor');
	}])
	//General options
	.factory('Menu', [ '$resource', function($resource) {
		return $resource('/api/menuOptions', {}, { 'get': {method:'GET', cache:true}});
	} ])
	.factory('Setting', [ '$resource', function($resource) {
		return $resource('/api/setting/:id', {id: '@id'}, {cache:true});
	} ])

	//Operator commands
	.factory('Operator', [ '$resource', function($resource) {
		return $resource('/api/operator/:id', {id:'@id'}, {cache:true});
	} ])

	//Robot commands
	.factory('Robot', [ '$resource', function($resource) {
		return $resource('/api/robot/:id', {id:'@id'}, {cache:true});
	} ])
	.factory('RobotModel', [ '$resource', function($resource) {
		return $resource('/api/robot/model/:id', {id:'@id'}, { 'get': {method:'GET', cache:true}});
	} ])
	.factory('Servo', [ '$resource', function($resource) {
		return $resource('/api/robot/:robot/servo/:id', {robot:'@robot', id:'@id', cache:true});
	} ])
	.factory('ServoGroup', [ '$resource', function($resource) {
		return $resource('/api/robot/:robot/servogroup/:id', {robot:'@robot', id:'@id', cache:true});
	} ])
	.factory('ServoConfig', [ '$resource', function($resource) {
		return $resource('/api/robot/:robot/servoconfig/:id', {robot:'@robot', id:'@id', cache:true});
	} ])
	.factory('ServoModel', [ '$resource', function($resource) {
		return $resource('/api/robot/servo/model/:id', {id:'@id'}, { 'get': {method:'GET', cache:true}});
	} ])
	.factory('RobotInterface', [ '$resource', function($resource) {
		return $resource('/api/robotinterface/:id', {id:'@id'}, {cache:true});
	} ])
	.factory('ServoInterface', [ '$resource', function($resource) {
		return $resource('/api/servointerface/:id', {id:'@id'}, {cache:true});
	} ])
	.factory('Sensor', [ '$resource', function($resource) {
		return $resource('/api/robot/:id/sensor/:id', {id:'@id'}, {cache:true});
	} ])
	.factory('SensorModel', [ '$resource', function($resource) {
		return $resource('/api/robot/sensor/model/:id', {id:'@id'}, { 'get': {method:'GET', cache:true}});
	} ])
	.factory('SensorGroup', [ '$resource', function($resource) {
		return $resource('/api/robot/:id/sensorgroup/:id', {id:'@id', cache:true});
	} ])
		
	//User commands
	.factory('User', [ '$resource', function($resource) {
		return $resource('/api/user/:id', {id:'@id'}, {cache:true});
	} ])
	.factory('CustomAction', [ '$resource', function($resource) {
		return $resource('/api/user/:uid/customaction/:id', {uid:'@user_id', id:'@id'}, {cache:true});
	} ])
	.factory('CustomTrigger', [ '$resource', function($resource) {
		return $resource('/api/user/:uid/customtrigger/:id', {uid:'@user_id', id:'@id'}, {cache:true});
	} ])

	//Actions
	.factory('OrderedAction', [ '$resource', function($resource) {
		return $resource('/api/orderedaction/:id', {id:'@id'}, {cache:true});
	} ])
	.factory('Action', [ '$resource', function($resource) {
		return $resource('/api/action/:id', {id:'@id'}, {cache:true});
	} ])
	.factory('ActionTest', [ '$resource', function($resource) {
		return $resource('/api/action/:id/test', {id:'@id'}, {cache:true});
	} ])
	.factory('ActionType', [ '$resource', function($resource) {
		return $resource('/api/action/type/:id', {id:'@id'}, { 'get': {method:'GET', cache:true}});
	} ])
	
	//Joints
	.factory('JointPosition', [ '$resource', function($resource) {
		return $resource('/api/jointposition/:id', {id:'@id'}, {cache:false});
	} ])
	
	//Triggers
	.factory('Trigger', [ '$resource', function($resource) {
		return $resource('/api/trigger/:id', {id:'@id'}, {cache:true});
	} ])
	.factory('TriggerType', [ '$resource', function($resource) {
		return $resource('/api/trigger/type/:id', {id:'@id'}, { 'get': {method:'GET', cache:true}});
	} ])
	.factory('ButtonHotKey', [ '$resource', function($resource) {
		return $resource('/api/trigger/:trigger/hotkey/:id', {trigger:'@trigger_id', id:'@id'}, {cache:true});
	} ])
	
	//Interaction
	.factory('Interaction', [ '$resource', function($resource) {
		return $resource('/api/interaction/:id', {id:'@id'}, {cache:false});
	} ])
	.factory('UserAction', [ '$resource', function($resource) {
		return $resource('/api/interaction/useraction/:button_id', {button_id:'@button_id'}, {cache:true});
	} ])
;
