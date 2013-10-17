# import logging
# # import time
# from servoRunner import ServoRunner
# 
# class PoseRunner(object):
#     
#     def __init__(self, robot):
#         self._robot = robot;
#         self._logger = logging.getLogger(__name__)
# 
#     def execute(self, pose):
#         sr = ServoRunner(self._robot)
#         for jointPosition in pose.jointPositions:
#             sr.prepare(jointPosition)
#         
#         sr.runPrepared();
#         # TODO: Do we need to check for done?
# #         while sr.busy():
# #             time.sleep(0.001)
# 
#     """
#     * Query whether the pose is valid and can be executed. A pose is valid if
#     * it was loaded completely from the file
#     *
#     * @return true if pose is valid, false otherwise
#     """
#     def isValid(self, pose):             
#         return len(pose.jointPositions) > 0
