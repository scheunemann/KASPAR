#!/usr/bin/env python
import sys
import os
import time


def getConnection(port='/dev/headServos'):
    sys.path.append('/home/pi/git/robotActionController')
    from robotActionController.Robot.ServoInterface.minimaestro import minimaestro
    try:
        return minimaestro(port, 115200)
    except Exception as e:
        print 'Err: %s' % e
    return None


def doScan(conn, ids):
    sIds = sorted(ids)
    while True:
        try:
            vals = dict((i, None) for i in sIds)
            for k in sIds:
                vals[k] = conn.getPosition(k)
            print ["%s: %s" % (k, vals[k]) for k in sIds]
            time.sleep(0.25)
        except KeyboardInterrupt:
            break


if __name__ == '__main__':
    if len(sys.argv) > 1:
        portName = sys.argv[1]
    else:
        print 'Err: port not specified'
        portName = None

    if portName:
        conn = getConnection(portName)
        doScan(conn, range(0, 18))
