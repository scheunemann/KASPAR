#!/usr/bin/env python

import logging, sys
logging.basicConfig()

import herkulexChecker as hc
import maestroChecker as m

bodyServos = hc.getConnection('/dev/bodyServos')
headServos = m.getConnection('/dev/headServos')
bodySensors = m.getConnection('/dev/bodySensors')
headSensors = m.getConnection('/dev/headSensors')

ids = [1, 2, 3, 4, 5, 6, 16, 17, 18, 19, 20, 32, 33, 34, 35, 36]


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
           temps = loop(bodyServos.getTemperature, ids)
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
