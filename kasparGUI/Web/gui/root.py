import os
import re
from flask import Flask, abort
from flask.helpers import send_file
_curDir = os.path.dirname(os.path.realpath(__file__))

if os.path.exists(os.path.join(_curDir, 'build')):
    _subDir = 'build'
    debug = False
else:
    _subDir = 'src'
    debug = True

_dir = os.path.join(_curDir, _subDir)
isFile = re.compile('(.*/)?.+\.[^/]+')
types = {'woff': 'application/x-font-woff'}

root = Flask(__name__, static_folder=None)


@root.route('/', defaults={'page': 'index.html'})
@root.route('/<path:page>')
def default(page):
    """since angular is set to html5Mode(true) anything that's not a direct file reference """
    """ has to redirect to the index.html file """
    """https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode"""
    if not isFile.match(page):
        page = 'index.html'

    if debug and page.startswith("bower_components"):
        page = '../' + page

    path = os.path.join(_dir, page)
#     if path.endswith('.tpl.htm') or path.endswith('.tpl.html'):
#         return render_template(page)

    _, ext = os.path.splitext(page)
    mimetype = types.get(ext, None)

    try:
        return send_file(path, mimetype)
    except IOError:
        abort(404)
