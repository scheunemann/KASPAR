module.exports = {
	hint : [ 'requirejs', 'jshint:src', ],
	build : [ 'clean:dist', 'bowercopy:libs', 'requirejs', ],
	test : [ 'clean:dist', 'bowercopy:libs', 'copy:src', ],
	default: [ 'clean:dist', 'bowercopy:libs', 'requirejs', 'jshint:dist', ],
};
