from flask.ext.restless import APIManager
from flask import Flask
from modules import blueprints, models
from database import db_session

root = Flask(__name__, static_folder=None)
manager = APIManager(root, session=db_session)

for opts in models:
    opts.setdefault('kwargs', {})
    opts['kwargs'].setdefault('methods', ['GET', 'PUT', 'POST', 'DELETE'])
    opts['kwargs'].setdefault('results_per_page', None)
    opts['kwargs'].setdefault('url_prefix', '')
    opts['kwargs'].setdefault('max_results_per_page', None)
    manager.create_api(opts['class'], **opts['kwargs'])

for blueprint in blueprints:
    root.register_blueprint(blueprint)


@root.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


@root.errorhandler(500)
def internal_error(exception):
    root.logger.exception(exception)
    print exception
