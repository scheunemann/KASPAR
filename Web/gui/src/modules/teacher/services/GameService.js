'use strict';

define(function(require) {
	var angular = require('angular');

	var GameService = function() {
		this.getGames = function() {
			return [ {
				name : 'Game 1',
				plays : 10,
				desc_short : 'Duis auctor neq...',
				desc_long : 'Duis auctor neque luctus nibh facilisis, at suscipit nunc mattis. Phasellus sollicitudin porta urna, eu lobortis tortor viverra eget. Mauris vitae orci orci. Sed faucibus est et ex semper tempor. Donec gravida nisi at leo pharetra pharetra. Etiam mauris ex, condimentum eget nulla nec, rutrum pulvinar odio. Vivamus ante lectus, pharetra id ex pulvinar, semper dictum sem. Etiam vitae congue dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas at tellus at massa commodo porttitor eu sed metus. Sed rutrum, risus at tincidunt porttitor, ipsum nisl posuere tellus, auctor ultrices metus felis vel metus. Integer elementum non velit vitae rutrum. Cras laoreet pharetra augue, et cursus odio consequat eget. Nulla leo justo, lacinia sed eros vitae, tempor sollicitudin lacus.',
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
				name : 'Game 2',
				plays : 10,
				desc_short : 'Pellentesque ha...',
				desc_long : 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla faucibus suscipit pretium. Nulla quis velit odio. Nunc quis condimentum nisi, et efficitur ipsum. Morbi sed libero sit amet ante venenatis auctor in sit amet lorem. Aliquam erat volutpat. In pulvinar ex vel turpis viverra condimentum. Pellentesque ut pulvinar turpis, ac sollicitudin elit. Cras accumsan ornare libero, in varius tortor malesuada non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec et finibus ante, sit amet bibendum mi. Sed vitae accumsan tellus, at aliquam erat.',
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
			}, {
				name : 'Game 3',
				plays : 10,
				desc_short : 'Lorem ipsum dol...',
				desc_long : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla non orci pharetra, ornare sapien a, pharetra elit. Proin non ultrices massa. Nam ac accumsan erat. Curabitur interdum volutpat nulla non porttitor. Aenean posuere leo sapien, at ullamcorper mi venenatis eu. Nunc fermentum sapien in leo tincidunt, sed porta libero porttitor. Praesent consequat justo quis felis elementum, et tincidunt ipsum finibus. Duis vestibulum erat non lacinia gravida. In neque urna, scelerisque sit amet tellus eget, vestibulum ullamcorper neque.',
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
			}, {
				name : 'Game 4',
				plays : 10,
				desc_short : 'Maecenas facili...',
				desc_long : 'Maecenas facilisis eleifend est. Nunc tristique iaculis sapien quis ullamcorper. Proin vitae magna vitae arcu semper suscipit a a eros. In posuere nulla erat, vel maximus metus tristique non. Duis et posuere erat. Morbi fermentum commodo congue. Integer pellentesque rhoncus risus, non tristique ex mollis nec.',
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
				desc_short : 'Lorem ipsum dol...',
				desc_long : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum ipsum at odio pharetra, et semper ligula venenatis. Curabitur et nisl massa. Nam a justo lacinia, porta est ut, porttitor nisl. Donec nec tortor id eros pellentesque dignissim. Maecenas vehicula orci at sapien faucibus finibus vel eget magna. Integer sit amet imperdiet massa, fermentum consectetur neque. Morbi gravida purus dapibus, semper mi at, ultrices erat. Vivamus ultricies at velit nec lobortis. Phasellus in justo id dui tempus pellentesque. Nulla ut nunc dapibus, vehicula risus pharetra, facilisis libero. Quisque vitae elit nec leo tincidunt molestie.',
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
				desc_short : 'Mauris luctus d...',
				desc_long : 'Mauris luctus dui in lectus efficitur fermentum. Duis a leo luctus, hendrerit orci in, pharetra turpis. Donec non feugiat est. Pellentesque accumsan ligula odio, in egestas nunc fermentum non. Etiam venenatis mi a justo lobortis interdum. Nam congue fermentum urna ut hendrerit. Cras eget nulla velit.',
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
			}, ];
		}
	};

	return GameService;
});
