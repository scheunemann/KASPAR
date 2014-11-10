#!/usr/bin/env python

import inspect

import logging, sys
logging.basicConfig()

import herkulexChecker as hc
import maestroChecker as m

bodyServos = hc.getConnection('/dev/bodyServos')
headServos = m.getConnection('/dev/headServos')
bodySensors = m.getConnection('/dev/bodySensors')
headSensors = m.getConnection('/dev/headSensors')


class IDS(object):
    class head(object):
        servos = [6, 7, 8, 9, 10, 11]
        sensors = [0, 1, 2, 3]
    class body(object):
        servos = [1, 2, 3, 4, 5, 6, 16, 17, 18, 19, 20, 32, 33, 34, 35, 36]
        sensors = [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11]

ids = IDS.body.servos


def help(obj=None):

    if obj == None:
        print "--------------------------------------------------"
        print "Helper module for command line debugging of KASPAR"
        print "--------------------------------------------------"
        print "Available Interfaces:"
        if bodyServos:
            print "  bodyServos: HerkuleX servos"
        if bodySensors:
            print "  bodySensors: FSRs connected to the body"
        if headServos:
            print "  headServos: Eye servos"
        if headSensors:
            print "  headSensors: FSRs connected to the head"
        print "ID Lists:"
        print "  IDS.head.servos: %s" % (IDS.head.servos, )
        print "  IDS.head.sensors: %s" % (IDS.head.sensors, )
        print "  IDS.body.servos: %s" % (IDS.body.servos, )
        print "  IDS.body.sensors: %s" % (IDS.body.sensors, )
        print "  ids===IDS.body.servos"
        print "Available methods:"
        print "  help(): Print this help"
        print "  help(object): Print information about an object"
        print "  loop(callable, ids, args): shortcut for a for loop"
        print "    calls the callable for each id, passing the optional args"
        print "    return a list with the results"
        print "    common usages:"
        print "      loop(bodyServos.getPosition, IDS.body.servos)"
        print "      loop(bodyServos.setLed, IDS.body.servos, bodyServos.LED_BLUE)"
        print "  checkTemps(maxTemp=80, outfile=None):"
        print "    poll the temperature on the body servos, outputting a warning"
        print "    when the maxTemp is reached, optionally outputting to a csv file"
    else:
        print "Available methods:"
        methods = getMethods(obj)
        for m in methods:
            print "  %s" % (m, )


def getMethods(obj):
    methods = inspect.getmembers(bodyServos, inspect.ismethod)
    ret = []
    for (name, m) in methods:
        argspec = inspect.getargspec(m)
        args = [a for a in argspec.args if a != 'self']
        ret.append("%s(%s)" % (name, ', '.join(args)))
    return ret

def loop(command, ids, *args):
    output = []
    for i in ids:
        o = command(i, *args)
        if o != None:
            output.append(o)
    return output


def checkTemps(maxTemp=80, outfile=None):
    import time, sys
    from datetime import timedelta

    baseTemp = 55
    start = time.time()
    if outfile:
       log = open(outfile, 'w')
       log.write("elapsed, ")
       log.write(", ".join([str(x) for x in ids]))
       log.write("\n")
    else:
       log = None
    overheated = False
    while True:
       try:
           temps = loop(bodyServos.getTemperature, IDS.body.servos)
           idTemps = zip(ids, temps)
           if overheated:
               cooled = filter(lambda x: x[1] < baseTemp, idTemps)
               overheat = []
           else:
               cooled = []
               overheat = filter(lambda x: x[1] > maxTemp, idTemps)

           elapsed = timedelta(seconds=round(time.time() - start))
           data = "%s, " % elapsed
           data += ", ".join(["%s:%s" % (x[0], x[1]) for x in idTemps])
           print data
           if log:
               log.write("%s, " % elapsed)
               log.write(", ".join([str(x) for x in temps]))
               log.write("\n")
               log.flush()

           if not overheated and overheat:
               heat = time.time()
               print >> sys.stderr, "WARNING: SERVO OVERHEAT! %s" % overheat
               print >> sys.stderr, "Time To Overheat: %s" % timedelta(heat - start)
               loop(bodyServos.torqueOFF, ids)
               overheated = True

           if overheated and len(cooled) == len(idTemps):
               cool = time.time()
               print >> sys.stderr, "INFO: ALL SERVOS COOLED!"
               print >> sys.stderr, "Time To Cool: %s" % timedelta(cool - heat)
               loop(bodyServos.torqueOFF, ids)
               break
       except KeyboardInterrupt:
           break
    if log:
        log.close()


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == 'temp':
        checkTemps(maxTemp=88, outfile='temperatureCurve.csv')
    else:
        import code
        c = code.InteractiveConsole(locals())
        c.push('help()')
        c.push('print ""')
        c.push('print "exit() to quit"')
        c.interact('------- KASPAR Debug Console -------')
else:
    help()
