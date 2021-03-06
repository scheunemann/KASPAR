#!/usr/bin/env python

import sys

import platform
if platform.system() == 'Linux':
	import syslog
	syslog.openlog(facility=syslog.LOG_LOCAL7)
else:
	class Log(object):
		def syslog(*args):
			if len(args) > 1 and args[0] == syslog.LOG_ERR:
				print >> sys.stderr, msg
			else:
				print msg

	syslog = Log()
import os
from collections import Sequence


DIFFSVO = 17
HEADVAL = 127
TRSOVAL = 0

HEADFLAG = 0B01
TRSOFLAG = 0B00


DIFFVAR = 'ID_USB_INTERFACE_NUM'
TTLVAL = 0B10
CMDVAL = 0B00

TTLFLAG = 0B10
CMDFLAG = 0B00

#TODO: Probably should move this to a config file...
CONFIG = {
          HEADFLAG | CMDFLAG: ['headServos', 'headSensors'],
          TRSOFLAG | TTLFLAG: 'bodyServos',
          TRSOFLAG | CMDFLAG: 'bodySensors',
}


def getPort():
    val = os.environ.get(DIFFVAR, None)
    if val != None:
        val = int(val)
        if val == TTLVAL:
            return TTLFLAG
        if val == CMDVAL:
            return CMDFLAG
    return None

def getType(port):
    from robotActionController.Robot.ServoInterface.minimaestro import minimaestro
    try:
        #Fragile, assume if it doesn't respond to getId, then it's the TTL port
        m = minimaestro(port, 115200)
        dId = m.getDeviceId()
        if dId >= 0:
            return CMDFLAG
        else:
            return TTLFLAG
    except Exception as e:
        print 'Err: %s' % e
    return None

def getLocation(port):
    from robotActionController.Robot.ServoInterface.minimaestro import minimaestro
    try:
        m = minimaestro(port, 115200)
        pos = m.getPosition(DIFFSVO)
        if pos >= HEADVAL:
            return HEADFLAG
        elif pos >= TRSOVAL:
            return TRSOFLAG
    except Exception as e:
        print 'Err: %s' % e
    return None


def addLink(sysPath, symPath):
    if isinstance(symPath, list):
        print symPath
        map(lambda x: addLink(sysPath, x), symPath)
        return

    fullPath = '/dev/%s' % symPath
    if os.path.islink(fullPath):
        try:
            os.unlink(fullPath)
        except Exception as e:
            syslog.syslog(syslog.LOG_ERR, 'Unable to remove old link %s, aborting.' % fullPath)
            return
    try:
        os.symlink(sysPath, fullPath)
        syslog.syslog('%s => %s Created' % (sysPath, fullPath))
    except Exception as e:
        syslog.syslog(syslog.LOG_ERR, '%s => %s Could not be Created. Reason= %s' % (sysPath, fullPath, e))


def handlePath(sysPath, symPath):
    if os.environ.get('ACTION', 'add') == 'add':
        addLink(sysPath, symPath)
    else:
        pass
        # try:
        #    os.unlink('/dev/%s' % symPath)
        #    log.write('%s => %s Removed\n' % (portName, symPath))
        # except Exception as e:
        #    log.write('%s => %s Could not be Removed. Reason= %s\n' % (portName, symPath, e))


if __name__ == '__main__':
    if os.environ.get('ACTION', None) == 'remove':
        # find a way to determine the symlink and remove the dead one
        syslog.syslog('MiniMaestro removed!!')
        exit()
    if len(sys.argv) > 1:
        portName = sys.argv[1]
    else:
        portName = os.environ.get('DEVNAME', None)
    syslog.syslog('Started: %s' % portName)
    # log.write('EnvVars: \n')
    # log.writelines(['    %s: %s\n' % (k, v) for (k, v) in os.environ.iteritems()])
    if portName:
        port = getPort()
        if port == TTLFLAG:
            cmdPort = '%s%s' % (portName[:-1], int(portName[-1]) - 1)
            ttlPort = portName
            # since we're pinging the CMD port here, we have a race condition with the actual CMD port
            # handle TTL and CMD creation only on the CMD port now...
            exit()
        else:
            ttlPort = '%s%s' % (portName[:-1], int(portName[-1]) + 1)
            cmdPort = portName
        loc = getLocation(cmdPort)
        if loc != None:
            ttlPath = CONFIG.get(loc | TTLFLAG, None)
            cmdPath = CONFIG.get(loc | CMDFLAG, None)
            if ttlPath:
                handlePath(ttlPort, ttlPath)
            else:
                syslog.syslog(syslog.LOG_ERR, 'Unable to determine sympath for %s.  loc: %s' % (ttlPort, loc))
            if cmdPath:
                handlePath(cmdPort, cmdPath)
            else:
                syslog.syslog(syslog.LOG_ERR, 'Unable to determine sympath for %s.  loc: %s' % (cmdPort, loc))
        else:
            syslog.syslog(syslog.LOG_ERR, 'Unable to determine location for %s.  loc: %s' % (portName, loc))

