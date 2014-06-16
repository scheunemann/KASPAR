import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../robotActionController')))

import platform
isWin = platform.system() == 'Windows'

import time

baseDir = os.path.dirname(os.path.realpath(__file__))
configDir = os.path.join(baseDir, '../KASPAR/Config/kasparConfigs')
print "Loading robot configs from %s" % configDir
from Robot import importer
(robots, _, _) = importer.loadAllDirectories(configDir)

from Data import Model
from Robot.ServoInterface.servoInterface import ServoInterface
from Robot.ServoInterface.herkulex import HerkuleX
herkulex = HerkuleX('COM23', 115200)

def chooseRobot(robots):
	if len(robots) > 1:
		selection = None
		while selection == None:
			print "Available Robots:"
			for i in range(0, len(robots)):
				print "  %s - %s" % (i + 1, robots[i].name)
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
	
def selectServo(robot):
	servos = sorted(robot.servos, key=lambda s: s.jointName)
	selection = None
	while selection == None:
		print "Joints:"
		for i in range(0, len(servos)):
			print "  %s - %s" % (i + 1, servos[i].jointName)
		print "  %s - Exit" % (i + 2)
		raw_sel = raw_input('Select Joint: ')
		try:
			selection = int(raw_sel)
		except ValueError:
			print 'Invalid Selection'
			time.sleep(1)
			clearScreen()
		else:
			if selection <= 0 or selection > len(servos) + 1:
				print 'Invalid Selection'
				time.sleep(1)
				clearScreen()
			else:
				break
	if selection - 1 == len(servos):
		return None
	servo = servos[selection - 1]
	return servo
	
def configureServo(servo):
	newId = int(servo.extraData['externalId'])
	servoInt = ServoInterface(servo)
	print "Scanning for servos..."
	ids = herkulex.performIDScan()
	print "Found %s servos, ids %s" % (len(ids), ids)
	if len(ids) == 0:
		print "No Servos detected"
		return
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
			raw_input('Press Enter to configure servo %s or ctrl+c to change selection or rescan servos' % oldId)
			clearScreen()
			print "Configuring servoID %s" % oldId
			setMaxVoltage(oldId, 15)
			minPos = int(servoInt._scaleToRealPos(servoInt._minPos)) - 20
			minPos = max(minPos, 0)
			maxPos = int(servoInt._scaleToRealPos(servoInt._maxPos)) + 20
			maxPos = min(maxPos, 1023)
			setRange(oldId, minPos, maxPos)
			setId(oldId, newId)
			reboot(newId)
			center(newId)
			if abs(herkulex.getPosition(newId) - 512) < 5:
				success(newId)
				print "Success"
			else:
				print "Servo not centred, may not be configured properly!"
		except KeyboardInterrupt:
			break

def setId(id, newId):
	print "Changing ID from %s to %s" % (id, newId)
	herkulex.set_ID(id, newId)

def setMaxVoltage(id, maxVoltage):
	EEPVOLT = 13
	print "Setting max voltage = %s " % maxVoltage
	volt = int(maxVoltage / 0.074)
	herkulex.writeRegistryEEP(id, EEPVOLT, volt)

def setRange(id, min, max):
	EEPMIN = 26
	EEPMAX = 28
	print "Setting range = [%s, %s]" % (min, max)
	herkulex.writeRegistryEEP(id, EEPMIN, min)
	herkulex.writeRegistryEEP(id, EEPMAX, max)

def reboot(id):
	herkulex.reboot(id)
	time.sleep(0.25)
	
def center(id):
	print "Centring servo"
	herkulex.moveOne(id, 512, 500)
	pass

def success(id):
	for i in range(0, 3):
		herkulex.setLed(id, HerkuleX.LED_GREEN)
		time.sleep(0.2)
		herkulex.setLed(id, HerkuleX.LED_BLUE)
		time.sleep(0.2)
	herkulex.setLed(id, 0)
	print "Stats - ID: %s, Position: %s, Voltage: %s" % (id, herkulex.getPosition(id), herkulex.getVoltage(id))
	
if __name__ == '__main__':
	clearScreen()
	robot = chooseRobot(robots)
	while True:
		try:
			clearScreen()
			servo = selectServo(robot)
			if servo == None:
				break
			configureServo(servo)
		except KeyboardInterrupt:
			pass
