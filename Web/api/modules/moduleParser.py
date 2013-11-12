import inspect
import os
import re
import sys


_modulesCache = {}

def loadModules(path=None):
    """loads all modules from the specified path or the location of this file if none"""
    """returns a dictionary of loaded modules {name: type}"""

    if path == None:
        path = __file__

    path = os.path.realpath(path)
    if not _modulesCache.has_key(path):
        modules = []

        find = re.compile(".*\.py$", re.IGNORECASE)
        if os.path.isdir(path):
            toLoad = map(lambda f: os.path.splitext(f)[0], filter(find.search, os.listdir(path)))
        else:
            toLoad = [os.path.splitext(os.path.basename(path))[0]]
        sys.path.append(os.path.dirname(path))

        for module in toLoad:
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
