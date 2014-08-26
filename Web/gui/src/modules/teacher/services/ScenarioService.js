'use strict';

define(function(require) {
	var angular = require('angular');

	var ScenarioService = function() {
		this.getScenarios = function() {
			return [ {
				name : 'A Scenario',
				plays : 10,
				desc_short : 'Pellentesque to...',
				desc_long : 'Pellentesque tortor sem, volutpat ac nisl vitae, hendrerit commodo turpis. Ut placerat pellentesque velit sed convallis. Integer orci tortor, malesuada sed sapien vel, euismod laoreet dolor. Proin finibus dolor sapien, ac tempor ligula bibendum eget. Suspendisse et diam sed nulla vestibulum lobortis. Duis sed urna est. Phasellus neque est, auctor accumsan molestie a, rutrum vel erat. Morbi luctus orci sed molestie scelerisque. Nullam iaculis, elit sit amet elementum varius, ipsum felis ullamcorper sem, et tempus tortor neque convallis eros. Donec tincidunt ante quis erat euismod volutpat.',
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
				desc_short : 'Praesent pharet...',
				desc_long : 'Praesent pharetra lacus eu sapien laoreet congue. Duis eleifend augue vel pulvinar vulputate. Donec in lobortis odio. Nam sit amet sodales magna. Phasellus at pellentesque urna. In condimentum erat ac efficitur vulputate. Ut quis volutpat neque. Ut sed luctus diam. Morbi consequat tellus nec facilisis rhoncus. In et ligula rhoncus, tempus metus a, gravida dui. Mauris massa dolor, lobortis vel nisl quis, pretium facilisis metus. Phasellus id odio vulputate, finibus nisl vel, laoreet velit. Sed vitae metus enim. Fusce vitae ligula nibh. Donec egestas, nulla sit amet efficitur accumsan, ligula nulla luctus justo, eu auctor ex sem auctor lorem.',
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
