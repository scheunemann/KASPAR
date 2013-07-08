import handlers, os
from menu import MenuData
from modules import moduleParser

name = "Site Root"
links = {}

root = handlers.Index(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'html/roboteditor.html'))
root.js = handlers.StaticFiles(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'js'))
root.images = handlers.StaticFiles(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'images'))
root.css = handlers.StaticFiles(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'css'))
root.favicon_ico = handlers.StaticFile(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'favicon.ico'))
root.data = MenuData(moduleParser.loadModules(root))
