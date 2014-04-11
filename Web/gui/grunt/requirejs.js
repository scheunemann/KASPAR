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
			removeCombined : true,
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
			uglify2 : {
				mangle : false,
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
			} ],
			wrap : {
				start : "(function() {",
				end : "}());"
			},
		}
	}
};