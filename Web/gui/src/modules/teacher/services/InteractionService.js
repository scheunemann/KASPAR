'use strict';

define(function(require) {
	var angular = require('angular');

	var InteractionService = function() {
		this.getInteractions = function() {
			return [ {
				date : '13/4/2014',
				totalTime : '30m',
				score : {
					'total' : 2,
					'parent' : {
						'experience' : 3,
					},
					'child' : {
						'experience' : 1,
						'engagement' : 1
					}
				},
				games : [ {
					name : 'Game 1',
					plays : 10,
					desc_short : 'This is a grea',
					desc_long : 'This is a great game to play with children!',
					totTime : '2h35m',
					lastPlay : '15/4/2014',
					thumbsrc : 'ability_thumb.png',
					fullsrc : 'ability.png',
					objectives : [ {
						title : 'Turn Taking',
						key : 'turntaking'
					}, {
						title : 'Interaction',
						key : 'interaction'
					} ],
					tags : [ {
						title : 'Slow',
						key : 'slow'
					}, {
						title : 'Movement',
						key : 'movement'
					} ],
				}, {
					name : 'Game 3',
					plays : 10,
					desc_short : 'This is a grea',
					desc_long : 'This is a great game to play with children!',
					totTime : '2h35m',
					lastPlay : '15/4/2014',
					thumbsrc : 'music_thumb.png',
					fullsrc : 'music.png',
					objectives : [ {
						title : 'Other',
						key : 'other'
					} ],
					tags : [ {
						title : 'Music',
						key : 'music'
					}, {
						title : 'Game',
						key : 'game'
					} ],
				}, ],
				notes : [ {
					title : 'A note',
					text : 'This is the body of a note'
				} ],
				user : {
					name : 'John Smith',
					birthday : '5/7/2008',
					gender : 'M',
					thumbsrc : 'boy_thumb.png',
					fullsrc : 'boy.png',
				}
			}, {
				date : '15/4/2014',
				totalTime : '30m',
				score : {
					'total' : 3,
					'parent' : {
						'experience' : 3,
					},
					'child' : {
						'experience' : 3,
						'engagement' : 3
					}
				},
				games : [ {
					name : 'Game 2',
					plays : 10,
					desc_short : 'This is a grea',
					desc_long : 'This is a great game to play with children!',
					totTime : '2h35m',
					lastPlay : '15/4/2014',
					thumbsrc : 'strategy_thumb.png',
					fullsrc : 'strategy.png',
					objectives : [ {
						title : 'Turn Taking',
						key : 'turntaking'
					}, {
						title : 'Interaction',
						key : 'interaction'
					} ],
					tags : [ {
						title : 'Quick',
						key : 'quick'
					}, {
						title : 'Movement',
						key : 'movement'
					} ],
				}, ],
				notes : [ {
					title : 'A note',
					text : 'This is the body of a note'
				} ],
				user : {
					name : 'John Smith',
					birthday : '5/7/2008',
					gender : 'M',
					thumbsrc : 'boy_thumb.png',
					fullsrc : 'boy.png',
				}
			}, {
				date : '17/4/2014',
				totalTime : '30m',
				score : {
					'total' : 5,
					'parent' : {
						'experience' : 4,
					},
					'child' : {
						'experience' : 5,
						'engagement' : 5
					}
				},
				games : [ {
					name : 'Game 4',
					plays : 10,
					desc_short : 'This is a grea',
					desc_long : 'This is a great game to play with children!',
					totTime : '2h35m',
					lastPlay : '15/4/2014',
					thumbsrc : 'puzzle_thumb.png',
					fullsrc : 'puzzle.png',
					objectives : [ {
						title : 'Other',
						key : 'other'
					}, {
						title : 'Interaction',
						key : 'interaction'
					} ],
					tags : [ {
						title : 'Quick',
						key : 'quick'
					}, {
						title : 'Talking',
						key : 'talking'
					} ],
				}, {
					name : 'Game 5',
					plays : 10,
					desc_short : 'This is a grea',
					desc_long : 'This is a great game to play with children!',
					totTime : '2h35m',
					lastPlay : '15/4/2014',
					thumbsrc : 'realtime_thumb.png',
					fullsrc : 'realtime.png',
					objectives : [ {
						title : 'Turn Taking',
						key : 'turntaking'
					}, {
						title : 'Other',
						key : 'other'
					} ],
				}, {
					name : 'Game 6',
					plays : 10,
					desc_short : 'This is a grea',
					desc_long : 'This is a great game to play with children!',
					totTime : '2h35m',
					lastPlay : '15/4/2014',
					thumbsrc : 'color_thumb.png',
					fullsrc : 'color.png',
					tags : [ {
						title : 'Interactive',
						key : 'interaction'
					}, {
						title : 'Talking',
						key : 'talking'
					} ],
				}, ],
				notes : [ {
					title : 'A note',
					text : 'This is the body of a note'
				} ],
				user : {
					name : 'Jill Smith',
					birthday : '5/7/2008',
					gender : 'F',
					thumbsrc : 'girl_thumb.png',
					fullsrc : 'girl.png',
				}
			} ];
		}
	};

	return InteractionService;
});
