#!/usr/bin/env python
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../robotActionController')))

import platform
isWin = platform.system() == 'Windows'

import time

baseDir = os.path.dirname(os.path.realpath(__file__))
configDir = os.path.join(baseDir, './kasparConfigs')
print "Loading robot configs from %s" % configDir
from robotActionController.Robot import importer
(robots, _, _) = importer.loadAllDirectories(configDir, loadActions=False, loadTriggers=False)

from robotActionController.Robot.ServoInterface.servoInterface import ServoInterface
from robotActionController.Robot.ServoInterface.herkulex import HerkuleX
if isWin:
    herkulex = HerkuleX('COM25', 115200)
else:
    herkulex = HerkuleX('/dev/bodyServos', 115200)

MAX_VOLTAGE = 8
VOLTAGE_INPUT = 7.4
VOLTAGE_VARIANCE = 2
POSITION_VARIANCE = 10
POSITION_PADDING = 20

DEAD_ZONE = 1
#SATURATOR_OFFSET = 48
#SATURATOR_SLOPE = 512

MIN_STRENGTH = 1
MAX_STRENGTH = 10
MIN_OFFSET = 0x01  # 0x00 = disabled
MAX_OFFSET = 0x5F  # 0xFE = hardware max
MIN_SLOPE = 0x4FF  # 0x00 = disabled
MAX_SLOPE = 0x1FFF  # 0x7FFF = hardware max


DELAY = 0.125


def chooseRobot(robots):
    if len(robots) > 1:
        robots = sorted(robots, key=lambda r: r.name)
        selection = None
        while selection == None:
            print "Available Robots:"
            for i in range(0, len(robots)):
                print "%s - %s" % (str(i + 1).rjust(4), robots[i].name)
            raw_sel = raw_input('Select Robot: ')
            try:
                selection = int(raw_sel)
            except ValueError:
                clearScreen()
                print "Invalid Selection"
            else:
                break
        robot = robots[selection - 1]
    else:
        robot = robots[0]
    return robot


def clearScreen():
    if isWin:
        os.system('cls')
    else:
        print chr(27) + "[2J"


def selectJoint(robot):
    servos = sorted(robot.servos, key=lambda s: s.jointName)
    selection = None
    while selection == None:
        print "Joints:"
        for i in range(0, len(servos)):
            sid = servos[i].extraData.get('externalId', None)
            if sid != None:
                print "%s - %s (servoId: %s)" % (str(i + 1).rjust(4), servos[i].jointName, sid)
            else:
                print "%s - %s" % (str('N/A').rjust(4), servos[i].jointName)
        print "%s - Re-configure all joints" % str(i + 2).rjust(4)
        print "ctrl+c - Exit"
        raw_sel = raw_input('Select Joint: ')
        try:
            selection = int(raw_sel)
        except ValueError:
            print 'Invalid Selection'
            time.sleep(1)
            clearScreen()
        else:
            if selection <= 0 or selection > len(servos) + 2:
                print 'Invalid Selection'
                time.sleep(1)
                clearScreen()
            else:
                break
    if selection == len(servos) + 1:
        return servos
    else:
        return servos[selection - 1]


def configureServo(servo):
    newId = int(servo.extraData['externalId'])
    servoInt = ServoInterface(servo)
    ids = []
    while True:
        entry = raw_input('Enter servoId to configure (default: %s), or 0 to scan: ' % newId)
        if entry == '':
            ids = [newId, ]
            break
        elif entry != '0':
            try:
                ids = [int(entry), ]
                break
            except ValueError:
                print "Invalid id..."
        else:
            while not ids:
                print "Scanning for servos..."
                ids = herkulex.performIDScan()
                print "Found %s servos, ids %s" % (len(ids), ids)
                if not ids:
                    raw_input("No Servos detected, check cables and press enter to rescan")
            break

    if len(ids) > 1:
        while True:
            try:
                oldId = int(raw_input('ServoID to configure: '))
            except ValueError:
                print "Invalid id..."
            else:
                break
    else:
        oldId = ids[0]
    while True:
        try:
            raw_input('Press Enter to configure servo %s or ctrl+c to change selection or rescan servos. ' % oldId)
            clearScreen()
            print "Configuring servoID %s as joint %s" % (oldId, servo.jointName)
            if doConfigure(oldId, servo, servoInt):
                setId(oldId, newId)
                success(newId)
                print "Success"
            else:
                print "Servo not configured properly!"
        except KeyboardInterrupt:
            break


def reconfigure(servos):
    for servo in servos:
        sid = servo.extraData.get('externalId', None)
        if not sid:
            continue
        sid = int(sid)
        print "-----------------------------"
        print "Re-configuring servo %s (%s)" % (servo.jointName, sid)
        if not servo.model.name == "HERKULEX":
            continue
        servoInt = ServoInterface(servo)
        if doConfigure(sid, servo, servoInt):
            success(sid)
            print "Success"
        else:
            print "Servo not configured properly!"
    print "-----------------------------"
    print "            Done"
    raw_input("   Press ENTER to contine")


def doConfigure(servoId, servo, servoInt):
    herkulex.clearError(servoId)
    time.sleep(DELAY)
    setMaxVoltage(servoId, MAX_VOLTAGE)
    minPos = int(servoInt._scaleToRealPos(servoInt._minPos)) - POSITION_PADDING
    minPos = max(minPos, 0)
    maxPos = int(servoInt._scaleToRealPos(servoInt._maxPos)) + POSITION_PADDING
    maxPos = min(maxPos, 1023)
    defPos = int(servoInt._scaleToRealPos(servoInt._defaultPosition))
    defPos = min(maxPos, defPos)
    defPos = max(minPos, defPos)
    setRange(servoId, minPos, maxPos)
    setCompliance(servoId, servo)
    reboot(servoId)
    center(servoId, defPos)
    print "Stats - Position: %s, Voltage: %s, Errors: %s" % (herkulex.getPosition(servoId), herkulex.getVoltage(servoId), herkulex.error_text(servoId))
    return isConfigured(servoId, defPos)


def setCompliance(sid, servo):
    strength = float(servo.extraData.get('STRENGTH', MAX_STRENGTH)) / MAX_STRENGTH
    offset = 0x00
    if strength == 0:
        #offset = 0x00
        slope = 0x00
        print "Disabling virtual spring"
    else:
        #offset = int(MAX_OFFSET * strength)
        slope = int(((MAX_SLOPE - MIN_SLOPE) * strength) + MIN_SLOPE)
        print "Setting virtual spring to strength %s%%" % (strength * 100)
    herkulex.writeRegistryEEP(sid, 0x10, DEAD_ZONE, 1)
    herkulex.writeRegistryEEP(sid, 0x11, offset, 1)
    herkulex.writeRegistryEEP(sid, 0x12, slope, 2)


def isConfigured(sid, defaultPos):
    pos = herkulex.getPosition(sid)
    volt = herkulex.getVoltage(sid)
    posCorrect = abs(pos - defaultPos) < POSITION_VARIANCE
    voltCorrect = abs(volt - VOLTAGE_INPUT) < VOLTAGE_VARIANCE
    errors = herkulex.error_text(sid)
    if errors:
        print "Errors: %s" % errors
    if not posCorrect:
        print "Got unexpected position!  Got: %s, Expected: %s" % (pos, defaultPos)
    if not voltCorrect:
        print "Got unexpected voltage!  Got: %s, Expected: %s" % (volt, VOLTAGE_INPUT)
    return posCorrect & voltCorrect & (not errors)


def setId(sid, newId):
    if sid == newId:
        return
    print "Changing ID from %s to %s" % (sid, newId)
    herkulex.set_ID(sid, newId)
    time.sleep(DELAY)


def setMaxVoltage(sid, maxVoltage):
    EEPVOLT = 13
    print "Setting max voltage = %s " % maxVoltage
    volt = int(maxVoltage / 0.074)
    herkulex.writeRegistryEEP(sid, EEPVOLT, volt, 1)
    time.sleep(DELAY)


def setRange(sid, minVal, maxVal):
    EEPMIN = 26
    EEPMAX = 28
    print "Setting range = [%s, %s]" % (minVal, maxVal)
        # reset range first (servos reject min > max or max < min
    herkulex.writeRegistryEEP(sid, EEPMIN, 0x0015, 2)
    time.sleep(DELAY)
    herkulex.writeRegistryEEP(sid, EEPMAX, 0x03EA, 2)
    time.sleep(DELAY)
    herkulex.writeRegistryEEP(sid, EEPMIN, minVal, 2)
    time.sleep(DELAY)
    herkulex.writeRegistryEEP(sid, EEPMAX, maxVal, 2)
    time.sleep(DELAY)


def reboot(sid):
    herkulex.reboot(sid)
    time.sleep(0.5)


def center(sid, defaultPos):
    print "Centring servo"
    herkulex.torqueON(sid)
    time.sleep(DELAY)
    herkulex.moveOne(sid, defaultPos, 500)
    time.sleep(1)


def success(sid):
    herkulex.clearError(sid)
    time.sleep(DELAY)
    for _ in range(0, 3):
        herkulex.setLed(sid, HerkuleX.LED_GREEN)
        time.sleep(0.1)
        herkulex.setLed(sid, HerkuleX.LED_BLUE)
        time.sleep(0.1)
    herkulex.setLed(sid, 0x00)
    time.sleep(0.1)
    herkulex.clearError(sid)
    time.sleep(0.1)

if __name__ == '__main__':
    clearScreen()
    robot = chooseRobot(robots)
    while True:
        try:
            clearScreen()
            joint = selectJoint(robot)
            if isinstance(joint, list):
                reconfigure(joint)
            else:
                configureServo(joint)
        except KeyboardInterrupt:
            break
