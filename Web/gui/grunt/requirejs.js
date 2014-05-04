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
		    keepBuildDir: true,
			inlineText : true,
			fileExclusionRegExp : /^\.|\.md|bower_components|bower.json|package.json/,
			paths : {
				angular : 'empty:',
				jquery : 'empty:',
				jqueryUI : 'empty:',
				angularSlider : 'empty:',
				angularBoostrap : 'empty:',
				angularResource : 'empty:',
				angularRoute : 'empty:',
				angularUIRouter : 'empty:',
				mousetrap : 'empty:',
				mousetrapPause : 'empty:',
			},
			uglify2 : {
				mangle : false,
			},
			modules : [ {
				name : 'app',
				exclude : [
							'angular',
							'jquery',
							'jqueryUI',
							'angularSlider',
							'angularBoostrap',
							'angularResource',
							'angularRoute',
							'angularUIRouter',
							'mousetrap',
							'mousetrapPause',
							'text'
							],
			} ],
			wrap : {
				start : "(function() {",
				end : "}());"
			},
		}
	}
};