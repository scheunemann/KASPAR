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
				angularXEditable : 'empty:',
				mousetrap : 'empty:',
				mousetrapPause : 'empty:',
				socketio: 'empty:',
			},
			uglify2 : {
				mangle : false,
			},
			modules : [ {
				name : 'fullapp',
			},{
				name : 'simpleapp',
			} ],
			wrap : {
				start : "(function() {",
				end : "}());"
			},
		}
	}
};
