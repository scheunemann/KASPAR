import cherrypy
import json

class MenuData(object):
    exposed = True
    
    def __init__(self, links):
        self._links = links
        #self._otherLinks = []
        
    def GET(self, *args, **kwargs):
        menu = {'title': 'Admin', 'groups': []}
        for (title, links) in self._links:
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
