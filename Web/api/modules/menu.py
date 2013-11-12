import cherrypy
import json


class MenuData(object):
    exposed = True

    def __init__(self, links):
        self._links = links

    def GET(self, *args, **kwargs):
        menu = {'groups': []}
        rootOrder = 1
        for item in self._links:
            section = { 'title': item['title'], 'order':rootOrder, 'links': [] }
            rootOrder += 1
            order = 0
            for (l_title, l_path) in item['links']:
                section['links'].append(
                         {
                          'path': l_path,
                          'title': l_title,
                          'order': order
                          })
                order += 1

            menu['groups'].append(section)

        cherrypy.response.headers['Content-Type'] = 'application/json'
        return json.dumps(menu)
