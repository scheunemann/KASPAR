from flask.ext.restless import APIManager
from modules import blueprints, models
from Web.site import app
from database import db_session

# app.converters.extend({'datetime': Helper})

manager = APIManager(app, session=db_session)

for opts in models:
    opts.setdefault('kwargs', {})
    opts['kwargs'].setdefault('methods', ['GET', 'PUT', 'POST', 'DELETE'])
    opts['kwargs'].setdefault('results_per_page', None)
    opts['kwargs'].setdefault('max_results_per_page', None)
    manager.create_api(opts['class'], **opts['kwargs'])

for blueprint in blueprints:
    app.register_blueprint(blueprint, url_prefix='/api')
