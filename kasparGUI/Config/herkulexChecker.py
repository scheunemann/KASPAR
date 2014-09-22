#!/usr/bin/env python
import sys
import os
import time


def getConnection(port='/dev/bodyServos', speed=115200):
    sys.path.append('/home/pi/git/robotActionController')
    from robotActionController.Robot.ServoInterface.herkulex import HerkuleX
    try:
        return HerkuleX(port, speed)
    except Exception as e:
        print 'Err: %s' % e
    return None


def doScan(conn, ids):
    sIds = sorted(ids)
    while True:
        try:
            vals = dict((k, None) for k in sIds)
            for id in sIds:
                vals[id] = conn.getPosition(id)
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
        doScan(conn, conn.performIDScan())
