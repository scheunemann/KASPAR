import flask
import flask.ext.sqlalchemy
import flask.ext.restless
import Data.config

app = flask.Flask(__name__)
app.config['DEBUG'] = Data.config.database_config['debug']
app.config['SQLALCHEMY_DATABASE_URI'] = "%(type)s://%(user)s:%(pass)s@%(host)s/%(db)s" % Data.config.database_config['engine']
db = flask.ext.sqlalchemy.SQLAlchemy(app)
Data.config.modelBase = db.Model

db.drop_all()
db.create_all()

from Data.Model import *

manager = flask.ext.restless.APIManager(app, flask_sqlalchemy_db=db)
manager.create_api(Operator, ['GET', 'POST', 'DELETE'])
app.run()


#
#import os
#import gui
#import api
#
#_dir = os.path.dirname(os.path.realpath(__file__))
#
#if __name__ == '__main__':
#    #global settings
#    cherrypy.config.update(conf)
#
#    #attach the database
#    SAPlugin.SAEnginePlugin(cherrypy.engine).subscribe()
#    cherrypy.tools.db = SAPlugin.SATool()
#
#    #mount the root paths
#    cherrypy.tree.mount(gui.root, '/', gui.config)
#    cherrypy.tree.mount(api.root, '/api', api.config)
#    cherrypy.tree.mount(None, '/ang', config = {
#          '/':{
#               'tools.staticdir.on': True,
#               'tools.staticdir.dir': os.path.join(_dir, 'angular-phonecat/app'),
#               'tools.staticdir.index': 'index.html'
#               }})
#    
#    #start the server
#    cherrypy.engine.start()
#    cherrypy.engine.block()


#import flask
#import flask.ext.sqlalchemy
#import flask.ext.restless
#
## Create the Flask application and the Flask-SQLAlchemy object.
#app = flask.Flask(__name__)
#app.config['DEBUG'] = True
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
#db = flask.ext.sqlalchemy.SQLAlchemy(app)
#
## Create your Flask-SQLALchemy models as usual but with the following two
## (reasonable) restrictions:
##   1. They must have an id column of type Integer.
##   2. They must have an __init__ method which accepts keyword arguments for
##      all columns (the constructor in flask.ext.sqlalchemy.SQLAlchemy.Model
##      supplies such a method, so you don't need to declare a new one).
#class Person(db.Model):
#    id = db.Column(db.Integer, primary_key=True)
#    name = db.Column(db.Unicode, unique=True)
#    birth_date = db.Column(db.Date)
#
#
#class Computer(db.Model):
#    id = db.Column(db.Integer, primary_key=True)
#    name = db.Column(db.Unicode, unique=True)
#    vendor = db.Column(db.Unicode)
#    purchase_time = db.Column(db.DateTime)
#    owner_id = db.Column(db.Integer, db.ForeignKey('person.id'))
#    owner = db.relationship('Person', backref=db.backref('computers',
#                                                         lazy='dynamic'))
#
#
## Create the database tables.
#db.create_all()
#
## Create the Flask-Restless API manager.
#manager = flask.ext.restless.APIManager(app, flask_sqlalchemy_db=db)
#
## Create API endpoints, which will be available at /api/<tablename> by
## default. Allowed HTTP methods can be specified as well.
#manager.create_api(Person, methods=['GET', 'POST', 'DELETE'])
#manager.create_api(Computer, methods=['GET'])
#
## start the flask loop
#app.run()