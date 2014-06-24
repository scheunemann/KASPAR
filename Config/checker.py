import logging
logging.basicConfig()

import herkulexChecker as hc
import maestroChecker as m

bodyServos = hc.getConnection('/dev/bodyServos')
headServos = m.getConnection('/dev/headServos')
bodySensors = m.getConnection('/dev/bodySensors')

ids = [1, 2, 3, 4, 5, 6, 16, 17, 18, 19, 20, 32, 33, 34, 35, 36]

def loop(command, ids, *args):
    output = []
    for i in ids:
        o = command(i, *args)
        if o != None:
            output.append(o)
    return output
