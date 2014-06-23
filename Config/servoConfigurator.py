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
from Robot import importer
(robots, _, _) = importer.loadAllDirectories(configDir)

from Data import Model
from Robot.ServoInterface.servoInterface import ServoInterface
from Robot.ServoInterface.herkulex import HerkuleX
if isWin:
	herkulex = HerkuleX('COM25', 115200)
else:
	herkulex = HerkuleX('/dev/bodyServos', 115200)

VOLTAGE_INPUT = 12
VOLTAGE_VARIANCE = 2
POSITION_VARIANCE = 10
POSITION_PADDING = 20

def chooseRobot(robots):
	if len(robots) > 1:
		selection = None
		while selection == None:
			print "Available Robots:"
			for i in range(0, len(robots)):
				print "%s - %s" % (str(i + 1).rjust(4), robots[i].name)
			raw_sel = raw_input('Select Robot: ')
			try:
				selection = int(raw_sel)
			except ValueError:
				print "Invalid Selection"
				time.sleep(1)
				clearScreen()
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
	print "Scanning for servos..."
	ids = []
	while not ids:
		ids = herkulex.performIDScan()
		print "Found %s servos, ids %s" % (len(ids), ids)
		if not ids:
			raw_input("No Servos detected, check cables and press enter to rescan")

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
			input = raw_input('Press Enter to configure servo %s or ctrl+c to change selection or rescan servos. ' % oldId)
			clearScreen()
			print "Configuring servoID %s as joint %s" % (oldId, servo.jointName)
			if doConfigure(oldId, servoInt):
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
		if doConfigure(sid, servoInt):
			success(sid)
			print "Success"
		else:
			print "Servo not configured properly!"
	print "-----------------------------"
	print "            Done"
        raw_input("   Press ENTER to contine")

def doConfigure(servoId, servoInt):
	herkulex.clearError(servoId)
	time.sleep(0.1)
	setMaxVoltage(servoId, 14)
	minPos = int(servoInt._scaleToRealPos(servoInt._minPos)) - POSITION_PADDING
	minPos = max(minPos, 0)
	maxPos = int(servoInt._scaleToRealPos(servoInt._maxPos)) + POSITION_PADDING
	maxPos = min(maxPos, 1023)
        defPos = int(servoInt._scaleToRealPos(servoInt._defaultPos))
        defPos = min(maxPos, defPos)
        defPos = max(minPos, defPos)
	setRange(servoId, minPos, maxPos)
	reboot(servoId)
	center(servoId, defPos)
        print "Stats - Position: %s, Voltage: %s, Errors: %s" % (herkulex.getPosition(servoId), herkulex.getVoltage(servoId), herkulex.error_text(servoId))
	return isConfigured(servoId, defPos)
			
def isConfigured(sid, defaultPos):
        pos = herkulex.getPosition(sid)
        time.sleep(0.1)
        volt = herkulex.getVoltage(sid)
        time.sleep(0.1)
	posCorrect = abs(pos - defaultPos) < POSITION_VARIANCE
	voltCorrect = abs(volt - VOLTAGE_INPUT) < VOLTAGE_VARIANCE
	errors = herkulex.error_text(sid)
        time.sleep(0.1)
	if errors:
		print "Errors: %s" % errors
	if not posCorrect:
                print "Got unexpected position!  Got: %s, Expected: %s" % (pos, defaultPos)
        if not voltCorrect:
                print "Got unexpected voltage!  Got: %s, Expected: %s" % (volt, VOLTAGE_INPUT)
	return posCorrect & voltCorrect & (not errors)

def setId(id, newId):
        if id == newId:
                return
	print "Changing ID from %s to %s" % (id, newId)
	herkulex.set_ID(id, newId)
	time.sleep(0.25)

def setMaxVoltage(id, maxVoltage):
	EEPVOLT = 13
	print "Setting max voltage = %s " % maxVoltage
	volt = int(maxVoltage / 0.074)
	herkulex.writeRegistryEEP(id, EEPVOLT, volt)
	time.sleep(0.25)

def setRange(id, min, max):
	EEPMIN = 26
	EEPMAX = 28
	print "Setting range = [%s, %s]" % (min, max)
	herkulex.writeRegistryEEP(id, EEPMIN, min)
	time.sleep(0.25)
	herkulex.writeRegistryEEP(id, EEPMAX, max)
	time.sleep(0.25)

def reboot(id):
	herkulex.reboot(id)
	time.sleep(0.5)
	
def center(id, defaultPos):
	print "Centring servo"
	herkulex.torqueON(id)
	time.sleep(0.1)
	herkulex.moveOne(id, defaultPos, 500)
	time.sleep(0.75)
	
def success(sid):
        herkulex.clearError(sid)
        time.sleep(0.1)
	for i in range(0, 3):
		herkulex.setLed(sid, HerkuleX.LED_GREEN)
		time.sleep(0.3)
		herkulex.setLed(sid, HerkuleX.LED_BLUE)
		time.sleep(0.3)
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
