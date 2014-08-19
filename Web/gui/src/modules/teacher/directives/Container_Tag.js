'use strict';

define(function(require) {
	var angular = require('angular');
	var template = require('text!./container_tag.tpl.html');

	var Container_Tag = function() {
		return {
			template : template,
			restrict : 'E',
			scope : {
				tag : '='
			},
			link : function(scope, element, attrs, controller) {
			},
			controller : function($scope) {
			}
		};
	};

	return Container_Tag;
});
