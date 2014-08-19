'use strict';

define(function(require) {
	var angular = require('angular');

	var ScenarioService = function() {
		this.getScenarios = function() {
			return [ {
				name : 'A Scenario',
				plays : 10,
				desc_short : 'Tests interact',
				desc_long : 'Tests interaction with music!',
				totTime : '2h35m',
				lastPlay : '15/4/2014',
				thumbsrc : 'singleplayer_thumb.png',
				fullsrc : 'singleplayer.png',
				author : {
					name : 'op'
				},
				objectives : [ {
					title : 'Turn Taking',
					key : 'turntaking'
				}, {
					title : 'Other',
					key : 'other'
				} ],
			}, {
				name : 'Another Scenario',
				plays : 10,
				desc_short : 'Turn taking wi',
				desc_long : 'Turn taking with touch!',
				totTime : '2h35m',
				lastPlay : '15/4/2014',
				thumbsrc : 'multiplayer_thumb.png',
				fullsrc : 'multiplayer.png',
				author : {
					name : 'UH'
				},
				objectives : [ {
					title : 'Turn Taking',
					key : 'turntaking'
				}, {
					title : 'Other',
					key : 'other'
				} ],
			}, ];
		}
	};

	return ScenarioService;
});
