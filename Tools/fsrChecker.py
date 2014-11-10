#!/usr/bin/env python
import time
import itertools

ids = {
       '/dev/bodySensors': [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11],
       '/dev/headServos': [0, 1, 2, 3]
      }

def getConnection(port='/dev/headServos'):
    from robotActionController.Robot.ServoInterface.minimaestro import minimaestro
    try:
        return minimaestro(port, 115200)
    except Exception as e:
        print 'Err: %s' % e
    return None


def doScan(ids):
    conns = dict(map(lambda x: (x, getConnection(x)), ids.keys()))
    length = max([len(x) for x in ids.keys()]) + 1
    while True:
        try:
            vals = {}
            for (port, conn) in conns.iteritems():
                if port not in ids:
                    continue
                #prefix = port.replace('/dev/', '')[0]
                for k in ids[port]:
                    vals["%s/%02d" % (port, k)] = conn.getPosition(k)
            
            for (prefix, items) in itertools.groupby(sorted(vals.keys()), lambda x: x[:x.rindex('/')]):
                print "%s: %s" % (prefix.rjust(length), ["%s: %03d" % (k[k.rindex('/')+1:], vals[k]) for k in sorted(items)])
            time.sleep(0.25)
        except KeyboardInterrupt:
            break


if __name__ == '__main__':
    doScan(ids)

