'use strict';

define(function(require) {
	var angular = require('angular');

	var InteractionService = function() {
		this.getInteractions = function() {
			return [ {
				date : '13/4/2014',
				time : '1:35pm',
				totalTime : '30m',
				score : {
					'total' : 1,
					'parent' : {
						'experience' : 2,
					},
					'child' : {
						'experience' : 1,
						'engagement' : 1
					}
				},
				games : [ {
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
				}, ],
				notes : [ {
					title : 'A note',
					text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tempus accumsan consectetur. Cras lobortis, lacus et blandit mattis, sem erat egestas eros, non placerat erat ante feugiat velit. Sed facilisis tortor eget sapien condimentum, eu malesuada mauris faucibus. Curabitur aliquam dolor eu ex molestie, ac auctor urna cursus. Donec vel accumsan nisl. Cras est odio, rhoncus at enim at, maximus aliquet nunc. Nullam dapibus egestas nibh. Vestibulum faucibus purus sit amet sagittis semper. Vestibulum finibus sem nec augue rutrum pretium. Donec elit lectus, convallis eu viverra sit amet, ornare sed turpis. Praesent condimentum et felis nec accumsan. Phasellus bibendum suscipit ultricies. Phasellus mattis risus vel finibus luctus. Curabitur erat orci, convallis eu sollicitudin et, pellentesque id turpis. Sed malesuada, turpis id luctus facilisis, sapien est pulvinar magna, ac semper leo urna eu libero. Donec vitae maximus odio, quis pharetra purus.\nDonec nibh lectus, consectetur id finibus pulvinar, volutpat sit amet leo. Praesent rhoncus magna odio, a placerat eros faucibus in. Sed fringilla finibus orci sed lacinia. Nullam varius diam et tellus iaculis, vel tristique nulla ultrices. Suspendisse tincidunt pulvinar tortor, eu iaculis ligula mattis nec. Praesent sodales egestas nisl ut ornare. Curabitur sed vulputate mi. In hendrerit bibendum scelerisque.'
				} ],
				user : {
					name : 'John Smith',
					birthday : '5/7/2008',
					gender : 'M',
					thumbsrc : 'user_thumb.png',
					fullsrc : '',
				}
			}, {
				date : '13/4/2014',
				time : '9:15pm',
				totalTime : '30m',
				score : {
					'total' : 2,
					'parent' : {
						'experience' : 3,
					},
					'child' : {
						'experience' : 1,
						'engagement' : 2
					}
				},
				games : [ {
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
				}, ],
				notes : [ {
					title : 'A note',
					text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sed est accumsan, euismod augue sit amet, feugiat nulla. Suspendisse a arcu eu augue feugiat efficitur eget vel augue. Mauris tempor sapien a rutrum vulputate. Donec ac cursus odio, eu scelerisque lectus. Proin pulvinar dictum arcu vitae laoreet. Morbi tincidunt dui sit amet purus consectetur faucibus. Donec libero urna, tincidunt nec porta vitae, bibendum ac massa. Vivamus ac est eros.'
				} ],
				user : {
					name : 'John Smith',
					birthday : '5/7/2008',
					gender : 'M',
					thumbsrc : 'user_thumb.png',
					fullsrc : '',
				}
			}, {
				date : '15/4/2014',
				totalTime : '30m',
				time : '1:35pm',
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
				}, ],
				notes : [ {
					title : 'A note',
					text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, odio quis imperdiet sodales, massa nisl pulvinar velit, ut facilisis urna odio vitae metus. Nulla pretium diam et commodo lobortis. Nunc ac cursus diam, vitae dapibus mi. Morbi bibendum elementum urna, vitae cursus nulla facilisis rutrum. Sed suscipit mauris mauris, eu imperdiet sem dignissim quis. Etiam massa risus, aliquet ac molestie sed, sollicitudin id felis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum nec urna ac enim sagittis semper. Sed rhoncus, nibh non elementum eleifend, nisl felis laoreet diam, vitae congue ex mi id elit. Phasellus malesuada urna a mattis pretium. Maecenas auctor porta libero, vitae aliquet risus. Ut viverra metus auctor purus vulputate, non vulputate justo volutpat.'
				} ],
				user : {
					name : 'John Smith',
					birthday : '5/7/2008',
					gender : 'M',
					thumbsrc : 'user_thumb.png',
					fullsrc : '',
				}
			}, {
				date : '16/4/2014',
				totalTime : '30m',
				time : '1:35pm',
				score : {
					'total' : 4,
					'parent' : {
						'experience' : 5,
					},
					'child' : {
						'experience' : 4,
						'engagement' : 3
					}
				},
				games : [ {
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
				}, ],
				notes : [ {
					title : 'A note',
					text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque molestie, odio quis imperdiet sodales, massa nisl pulvinar velit, ut facilisis urna odio vitae metus. Nulla pretium diam et commodo lobortis. Nunc ac cursus diam, vitae dapibus mi. Morbi bibendum elementum urna, vitae cursus nulla facilisis rutrum. Sed suscipit mauris mauris, eu imperdiet sem dignissim quis. Etiam massa risus, aliquet ac molestie sed, sollicitudin id felis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum nec urna ac enim sagittis semper. Sed rhoncus, nibh non elementum eleifend, nisl felis laoreet diam, vitae congue ex mi id elit. Phasellus malesuada urna a mattis pretium. Maecenas auctor porta libero, vitae aliquet risus. Ut viverra metus auctor purus vulputate, non vulputate justo volutpat.'
				} ],
				user : {
					name : 'John Smith',
					birthday : '5/7/2008',
					gender : 'M',
					thumbsrc : 'user_thumb.png',
					fullsrc : '',
				}
			}, {
				date : '17/4/2014',
				totalTime : '30m',
				time : '1:35pm',
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
				}, ],
				notes : [ {
					title : 'A note',
					text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempor ultricies quam. Nulla tristique risus lobortis metus sodales ornare. Duis iaculis condimentum nulla, nec mollis turpis semper id. Fusce in mi tellus. Donec vel euismod libero. Ut ac tempor ante, quis hendrerit purus. Nulla quis nisi velit. Aenean cursus ipsum et interdum commodo. Aliquam nibh massa, dignissim eget ex et, eleifend convallis orci. Suspendisse posuere tortor fringilla tortor facilisis convallis. Morbi ullamcorper felis ac ex volutpat rhoncus.'
				} ],
				user : {
					name : 'Jill Smith',
					birthday : '5/7/2008',
					gender : 'F',
					thumbsrc : 'user_thumb.png',
					fullsrc : 'girl.png',
				}
			} ];
		}
	};

	return InteractionService;
});
