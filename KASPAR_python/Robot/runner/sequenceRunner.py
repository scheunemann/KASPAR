# import logging
# from actionRunner import ActionRunner
# 
# class SequenceRunner(object):
# 
#     def __init__(self, robot):
#         self._robot = robot
#         self._logger = logging.getLogger(__name__)
# 
#     def execute(self, sequence):
#         ar = ActionRunner(self._robot)
#         for orderedAction in sorted(sequence.actions, key=lambda a: a.order):
#             ar.execute(orderedAction.action)
# #             try {
# #                 Thread.sleep(action.getWaitAfter());
# #             } catch (InterruptedException ex) {
# #                 GuiLogger.getLogger().log(Level.SEVERE, null, ex);
# #                 return;
# #             }
