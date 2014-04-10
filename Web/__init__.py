#from flask import Flask
#app = Flask(__name__, static_folder=None)

#import gui.paths
#app.register_blueprint(gui.paths.root)
#gui.paths.excludePaths.append('api')

#import api.paths
# Because of the way flask handles nested blueprints, this is handled in api.root
# app.register_blueprint(api.root, url_prefix='/api')
