#!/usr/bin/env python
import sys
import os
import time


def getConnection(port='/dev/bodyServos'):
    #     sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../robotActionController')))
    from robotActionController.Robot.ServoInterface.dynamixel import ServoController
    try:
        return ServoController(port, 57600)
    except Exception as e:
        print 'Err: %s' % e
    return None


def loop(command, ids, *args):
    output = []
    for i in ids:
        o = command(i, *args)
        if o != None:
            output.append(o)
    return output


def doScan(conn, ids):
    sIds = sorted(ids)
    while True:
        try:
            vals = dict((k, None) for k in sIds)
            for id in sIds:
                vals[id] = conn.GetPosition(id)
            print ["%s: %s" % (k, vals[k]) for k in sIds]
            time.sleep(0.25)
        except KeyboardInterrupt:
            break

ids = range(1, 18)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        portName = sys.argv[1]
    else:
        print 'Err: port not specified'
        portName = None

    if portName:
        conn = getConnection(portName)
        doScan(conn, conn.performIDScan())
