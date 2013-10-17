# import logging
# import time
# from pygame.mixer import Sound #apt-get install python-pygame (will be added when support beyone WAV is needed)
# 
# class SoundRunner(object):
#     
#     def __init__(self, robot):
#         self._robot = robot
#         self._logger = logging.getLogger(__name__)
#         
#     def execute(self, sound):
#         s = Sound(sound.data)
#         channel = s.play()
#         while channel.get_busy():
#             time.sleep(0.001)