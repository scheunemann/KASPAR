'use strict';

angular.module('dataModels', [ 'ngResource' ])
	//General options
	.factory('Menu', [ '$resource', function($resource) {
		return $resource('/api/menuOptions', {}, { 'get': {method:'GET'}});
	} ])

	//Operator commands
	.factory('Operator', [ '$resource', function($resource) {
		return $resource('/api/operator/:id', {id:'@id'});
	} ])

	//Robot commands
	.factory('Robot', [ '$resource', function($resource) {
		return $resource('/api/robot/:id', {id:'@id'});
	} ])
	.factory('RobotType', [ '$resource', function($resource) {
		return $resource('/api/robot/type/:id', {id:'@id'}, { 'get': {method:'GET'}});
	} ])
	.factory('Servo', [ '$resource', function($resource) {
		return $resource('/api/robot/:id/servo:id', {id:'@id'});
	} ])
	.factory('ServoGroup', [ '$resource', function($resource) {
		return $resource('/api/robot/:id/servogroup:id', {id:'@id'});
	} ])
	.factory('ServoConfig', [ '$resource', function($resource) {
		return $resource('/api/robot/:id/servoconfig/:id', {id:'@id'});
	} ])
	.factory('ServoType', [ '$resource', function($resource) {
		return $resource('/api/robot/servo/type/:id', {id:'@id'}, { 'get': {method:'GET'}});
	} ])
	.factory('Sensor', [ '$resource', function($resource) {
		return $resource('/api/robot/:id/sensor/:id', {id:'@id'});
	} ])
	.factory('SensorType', [ '$resource', function($resource) {
		return $resource('/api/robot/sensor/type/:id', {id:'@id'}, { 'get': {method:'GET'}});
	} ])
	.factory('SensorGroup', [ '$resource', function($resource) {
		return $resource('/api/robot/:id/sensorgroup/:id', {id:'@id'});
	} ])
		
	//User commands
	.factory('User', [ '$resource', function($resource) {
		return $resource('/api/user/:id', {id:'@id'});
	} ])
	.factory('CustomAction', [ '$resource', function($resource) {
		return $resource('/api/user/:id/action/:id', {id:'@id'});
	} ])
	.factory('CustomTrigger', [ '$resource', function($resource) {
		return $resource('/api/user/:id/trigger/:id', {id:'@id'});
	} ])

	//Actions
	.factory('Action', [ '$resource', function($resource) {
		return $resource('/api/action/:id', {id:'@id'});
	} ])
	.factory('ActionTypes', [ '$resource', function($resource) {
		return $resource('/api/action/types/:id', {id:'@id'}, { 'get': {method:'GET'}});
	} ])
	
	//Joints
	.factory('Joint', [ '$resource', function($resource) {
		return $resource('/api/joint/:id', {rid:'@id'});
	} ])
	
	//Triggers
	.factory('Trigger', [ '$resource', function($resource) {
		return $resource('/api/trigger/:id', {id:'@id'});
	} ])
	.factory('TriggerTypes', [ '$resource', function($resource) {
		return $resource('/api/trigger/types/:id', {id:'@id'}, { 'get': {method:'GET'}});
	} ])
;
