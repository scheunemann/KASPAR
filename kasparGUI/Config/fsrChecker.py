#!/usr/bin/env python
import time

ids = {
       '/dev/bodyServos': [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11],
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
    while True:
        try:
            vals = {}
            for (port, conn) in conns.iteritems():
                if port not in ids:
                    continue
                prefix = port.replace('/dev/', '')[0]
                for k in ids[port]:
                    vals[prefix + str(k)] = conn.getPosition(k)
                
            print ["%s: %s" % (k, vals[k]) for k in sorted(vals.keys())]
            time.sleep(0.25)
        except KeyboardInterrupt:
            break


if __name__ == '__main__':
    doScan(ids)

