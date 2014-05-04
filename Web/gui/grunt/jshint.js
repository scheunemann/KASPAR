module.exports = {
	src : {
		src : [ "src/**/*.js", "Gruntfile.js" ],
		options: {
			globalstrict: true,
			globals: {
				'define': false,
			}
		}
	},
	dist : {
		src : "dist/app.js",
	}
}