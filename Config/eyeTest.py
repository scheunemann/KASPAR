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
(robots, _, _) = importer.loadAllDirectories(configDir, loadActions=False, loadTriggers=False)

from Data.storage import StorageFactory
from Data.Model import Base, Robot
StorageFactory.config['engine'].update({'type': 'Sqlite'})
Base.metadata.create_all(StorageFactory.getDefaultDataStore().engine)
session = StorageFactory.getNewSession()
session.add_all(robots)
session.commit()
robots = session.query(Robot).all()

from Robot.ServoInterface.servoInterface import ServoInterface

def clearScreen():
	if isWin:
		os.system('cls')
	else:
		print chr(27) + "[2J"

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
	
def selectJoint(robot):
	servos = sorted(robot.servos, key=lambda s: s.jointName)
	selection = None
	while selection == None:
		print "Joints:"
		for i in range(0, len(servos)):
			sid = servos[i].extraData.get('externalId', servos[i].model.name)
			print "%s - %s (servoId: %s)" % (str(i + 1).rjust(4), servos[i].jointName, sid)
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
	if selection == len(servos) + 1:
		return servos
	else:
		return servos[selection - 1]

def center(servo):
	servoInt = ServoInterface.getServoInterface(servo)
	servoInt.setPosition(servo.defaultPosition or 0, servo.defaultSpeed or 100)
	
if __name__ == '__main__':
	clearScreen()
	robot = chooseRobot(robots)
	while True:
		try:
			clearScreen()
			joint = selectJoint(robot)
			center(joint)
		except KeyboardInterrupt:
			break
