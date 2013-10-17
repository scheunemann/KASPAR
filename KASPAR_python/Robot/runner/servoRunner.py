# import logging
# from Robot.servoInteface.servoInterface import ServoInterface
# 
# class ServoRunner(object):
# 
#     def __init__(self, robot):
#         self._robot = robot;
#         self._servoPositions = {}
#         self._logger = logging.getLogger(__name__)
# 
# # TODO: Should be elsewhere...
# #     def enableManualPositioning(self, *servos):
# #         for servo in servos:
# #             if servo.poseable:
# #                 try:
# #                     ServoInterface.getServoInterface(servo).setPositioning(True)
# #                 except ValueError:
# #                     pass
# #             else:
# #                 self._logger.debug("Skipping enable manual positioning on %s as it is not poseable.", servo)
# #                 
# #     def disableManualPositioning(self, *servos):
# #         for servo in servos:
# #             if servo.poseable:
# #                 try:
# #                     ServoInterface.getServoInterface(servo).setPositioning(False)
# #                 except ValueError:
# #                     pass
# #             else:
# #                 self._logger.debug("Skipping enable manual positioning on %s as it is not poseable.", servo)
# 
#     def prepare(self, jointPosition):
#         servos = filter(lambda s: s.jointName == jointPosition.jointName, self._robot.servos)
#         if len(servos) != 1:
#             self._logger.critical("Could not determine appropriate servo on Robot(%s).  Expected 1 match, got %s", self._robot.name, len(servos))
#             raise ValueError
#             
#         servoInterface = ServoInterface.getServoInterface(servos[0])
#         self._servoPositions[servoInterface] = jointPosition
# 
#     def clearPrepared(self):
#         self._servoPositions.clear()
# 
#     def runPrepared(self):
#         for (interface, jointPosition) in self._servoPositions:
#             interface.setPosition(jointPosition.angle, jointPosition.speed)
