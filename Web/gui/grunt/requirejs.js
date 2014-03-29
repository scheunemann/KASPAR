module.exports = {
	compile : {
		options : {
			baseUrl : './src',
			mainConfigFile : './src/main.js',
			dir : 'build',
			optimize : 'uglify2',
			generateSourceMaps : true,
			preserveLicenseComments : false,
			findNestedDependencies : true,
			removeCombined: true,
			inlineText : true,
			fileExclusionRegExp : /^\.|\.md|bower.json|package.json/,
			paths : {
				angular : 'empty:',
				angularSlider : 'empty:',
				angularUIRouter : 'empty:',
				angularResource : 'empty:',
				angularRoute : 'empty:',
				angularToggleSwitch : 'empty:',
				angularBoostrap : 'empty:',
				mousetrap : 'empty:',
				mousetrapPause : 'empty:'
			},
			modules : [ {
				name : 'app',
				override : {
					findNestedDependencies : true,
				},
				exclude : [
							'angular',
							'angularSlider',
							'angularUIRouter',
							'angularResource',
							'angularRoute',
							'angularToggleSwitch',
							'angularBoostrap',
							'mousetrap',
							'mousetrapPause',
							'text' ],
			// }, {
			// name : 'actions/controllers',
			// }, {
			// name : 'actions/directives',
			// }, {
			// name : 'actions/models',
			// }, {
			// name : 'common/controllers',
			// }, {
			// name : 'common/directives',
			// }, {
			// name : 'common/filters',
			// }, {
			// name : 'common/models',
			// }, {
			// name : 'interactions/controllers',
			// }, {
			// name : 'interactions/directives',
			// }, {
			// name : 'interactions/models',
			// }, {
			// name : 'operators/controllers',
			// }, {
			// name : 'operators/directives',
			// }, {
			// name : 'operators/models',
			// }, {
			// name : 'robots/controllers',
			// }, {
			// name : 'robots/directives',
			// }, {
			// name : 'robots/models',
			// }, {
			// name : 'triggers/controllers',
			// }, {
			// name : 'triggers/directives',
			// }, {
			// name : 'triggers/models',
			} ],
			wrap : {
				start : "(function() {",
				end : "}());"
			},
		}
	}
};