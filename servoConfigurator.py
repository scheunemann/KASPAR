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
			print "%s - %s" % (str(i + 1).rjust(4), servos[i].jointName)
		print "ctrl+c - Exit"
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
	servo = servos[selection - 1]
	return servo
	
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
			autoloop = input == 'l'
			clearScreen()
			print "Configuring servoID %s as joint %s" % (oldId, servo.jointName)
			setMaxVoltage(oldId, 15)
			minPos = int(servoInt._scaleToRealPos(servoInt._minPos)) - 20
			minPos = max(minPos, 0)
			maxPos = int(servoInt._scaleToRealPos(servoInt._maxPos)) + 20
			maxPos = min(maxPos, 1023)
			setRange(oldId, minPos, maxPos)
			reboot(oldId)
			center(oldId)
			if isConfigured(oldId):
				setId(oldId, newId)
				success(newId)
				print "Success"
			else:
				print "Servo not configured properly!"
		except KeyboardInterrupt:
			break

			
def isConfigured(sid):
	posCorrect = abs(herkulex.getPosition(sid) - 512) < 5
	voltCorrect = abs(herkulex.getVoltage(sid) - 12) < 0.5
	errors = herkulex.error_text(sid)
	if errors:
		print "Errors: %s" % errors
	return posCorrect & voltCorrect & (not errors)

def setId(id, newId):
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
	
def center(id):
	print "Centring servo"
	herkulex.torqueON(id)
	time.sleep(0.1)
	herkulex.moveOne(id, 512, 500)
	time.sleep(0.5)
	
def success(sid):
	print "Stats - ID: %s, Position: %s, Voltage: %s" % (sid, herkulex.getPosition(sid), herkulex.getVoltage(sid))
	for i in range(0, 3):
		herkulex.setLed(sid, HerkuleX.LED_GREEN)
		time.sleep(0.2)
		herkulex.setLed(sid, HerkuleX.LED_BLUE)
		time.sleep(0.2)
	herkulex.setLed(sid, 0)
	
if __name__ == '__main__':
	clearScreen()
	robot = chooseRobot(robots)
	while True:
		try:
			clearScreen()
			joint = selectJoint(robot)
			configureServo(joint)
		except KeyboardInterrupt:
			break
