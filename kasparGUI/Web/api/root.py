from flask.ext.restless import APIManager
from flask.ext.restless.views import get_relations
from flask import Flask
from modules import blueprints, models, init_app as moduleInit
from database import db_session
from kasparGUI.Model import Base

root = Flask(__name__, static_folder=None)
manager = APIManager()


def init_app(app):
    moduleInit(app)

    manager.init_app(app, session=db_session)
    for opts in models:
        opts.setdefault('kwargs', {})
        opts['kwargs'].setdefault('methods', ['GET', 'PUT', 'POST', 'DELETE'])
        opts['kwargs'].setdefault('results_per_page', None)
        opts['kwargs'].setdefault('url_prefix', '')
        opts['kwargs'].setdefault('max_results_per_page', None)
        opts['kwargs'].setdefault('include_methods', get_includes(opts['class']))
        opts['kwargs'].setdefault('preprocessors', {'PATCH_SINGLE': [__delink], 'POST': [__delink]})
        manager.create_api(opts['class'], **opts['kwargs'])

    for blueprint in blueprints:
        app.register_blueprint(blueprint)


def __delink(data, **kwargs):
    if type(data) == dict:
        data.pop('_link', None)
        values = data.itervalues()
    elif type(data) == list:
        values = data
    else:
        values = []
    for value in values:
        __delink(value)


def get_includes(class_):
    includes = ['_link', ]
    for item in frozenset(get_relations(class_)):
        includes.append(item + '._link')
    return includes


def __link(instance):
    name = type(instance).__name__
    link = "%s/%s" % (name, instance.id)
    return {'model': name, 'href': link}

Base._link = __link
init_app(root)


@root.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


# @root.errorhandler(500)
# def internal_error(exception):
#     import traceback
#     print exception
#     print traceback.format_exc()
#     raise exception

