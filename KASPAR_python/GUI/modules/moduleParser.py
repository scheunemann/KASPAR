import re
import sys
import inspect

def loadModules(root):
    import os
    modules = []

    find = re.compile(".*\.py$", re.IGNORECASE)
    for module in map(lambda f: os.path.splitext(f)[0], filter(find.search, os.listdir(os.path.dirname(os.path.realpath(__file__))))):
        try:
            modules.append(__import__(module, globals(), locals()))
        except Exception as e:
            print >> sys.stderr, "Unable to import module %s, Exception: %s" % (module, e)

    ret = []
    for module in modules:
        for n, t in inspect.getmembers(module, inspect.isclass):
            if hasattr(t, "exposed") and hasattr(t, "title") and hasattr(t, "links") and t.exposed:
                links = []
                for link in t.links:
                    links.append((link[0], "%s/%s" %(n.lower(), link[1])))
                    
                ret.append((t.title, links))
                root.__dict__[n.lower()] = t()
            else:
                print "Skipping module %s due to missing attributes" % n
                
    return ret