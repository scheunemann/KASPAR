from flask.ext.restless import APIManager
from flask import Flask
from modules import blueprints, models
from sqlalchemy.orm import scoped_session
from Data.storage import StorageFactory
from Config.config import dbConfig
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
