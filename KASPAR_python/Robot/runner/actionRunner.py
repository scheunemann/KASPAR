# import logging
# from Data.Model.Action import Sequence, Group, Sound, Pose
# from sequenceRunner import SequenceRunner
# from poseRunner import PoseRunner
# from soundRunner import SoundRunner
# from groupRunner import GroupRunner
# 
# class ActionRunner(object):
# 
#     def __init__(self, robot):
#         self._robot = robot;
#         self._logger = logging.getLogger(__name__)
# 
#     @staticmethod
#     def isValid(action):
#         #TODO: check for valid
#         return action != None
# 
#     def execute(self, action):
#         if type(action) == Sequence:
#             SequenceRunner(self._robot).execute(action)
#         elif type(action) == Pose:
#             PoseRunner(self._robot).execute(action)
#         elif type(action) == Sound:
#             SoundRunner(self._robot).execute(action)
#         elif type(action) == Group:
#             GroupRunner(self._robot).execute(action)
#         else:
#             self._logger.critical("Could not determine action type for %s" % (action))
