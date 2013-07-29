import re
import sys
import inspect

_modulesCache = {}

def loadModules(path=None):
    """loads all modules from the specified path or the location of this file if none"""
    """returns a dictionary of loaded modules {name: type}"""

    if path == None:
        path = __file__
     
    if not _modulesCache.has_key(path):
         
        import os
        modules = []
            
        find = re.compile(".*\.py$", re.IGNORECASE)
        for module in map(lambda f: os.path.splitext(f)[0], filter(find.search, os.listdir(os.path.dirname(os.path.realpath(path))))):
            try:
                modules.append(__import__(module, globals(), locals()))
            except Exception as e:
                print >> sys.stderr, "Unable to import module %s, Exception: %s" % (module, e)
    
        ret = {}
        for module in modules:
            for name, type_ in inspect.getmembers(module, inspect.isclass):
                if hasattr(type_, "exposed") and hasattr(type_, "title") and hasattr(type_, "links"):
                    if type_.exposed:
                        ret[name] = type_()
                    else:
                        print "Skipping module %s as it is disabled" % name
                else:
                    print "Skipping module %s due to missing attributes" % name
        
        _modulesCache[path] = ret
                
    return _modulesCache[path]