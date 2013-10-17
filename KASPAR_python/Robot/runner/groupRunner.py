# from multiprocessing.pool import ThreadPool
# 
# class GroupRunner(object):
#     
#     def __init__(self, robot):
#         self._robot = robot
#         self._threadPool = ThreadPool()
# 
#     def execute(self, group):
#         self._threadPool.map(lambda a: ActionRunner(self._robot).execute(a), group.actions)