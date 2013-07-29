import cherrypy
import json

class MenuData(object):
    exposed = True
    
    def __init__(self, links):
        self._links = links
        
    def GET(self, *args, **kwargs):
        menu = {'groups': []}
        for title, links in self._links.iteritems():
            section = { 'title': title, 'links': [] }
                        
            for (l_title, l_path) in links:
                section['links'].append(
                         {
                          'path': l_path,
                          'title': l_title
                          })
        
            menu['groups'].append(section)
        
        cherrypy.response.headers['Content-Type'] = 'application/json'
        return json.dumps(menu)
