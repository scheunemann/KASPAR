'use strict';

define(function(require) {
	var angular = require('angular');

	var TagService = function() {
		this.getTags = function() {
			return [ {
				title : 'Slow',
				key : 'slow'
			}, {
				title : 'Movement',
				key : 'movement'
			}, {
				title : 'Quick',
				key : 'quick'
			}, {
				title : 'Music',
				key : 'music'
			}, {
				title : 'Game',
				key : 'game'
			}, {
				title : 'Talking',
				key : 'talking'
			}, {
				title : 'Interactive',
				key : 'interaction'
			} ];
		};
	};

	return TagService;
});
