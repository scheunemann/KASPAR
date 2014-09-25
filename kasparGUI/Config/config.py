import logging
import platform
import sys
import os


if platform.system() == 'Linux':
    webConfig = {
            'server.socket_host': '0.0.0.0',
            'server.socket_port': 80,
            'server.thread_pool': 10,
            'server.thread_pool_max': -1,
            'JSON_AS_ASCII': False,
            'DEBUG': True,
            'loglevel': logging.DEBUG,
    #         'environment': 'production'
    }
    dbConfig = {
         'type': 'Sqlite',
         'file': os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../kaspar.db'))
    }
else:
    webConfig = {
            'server.socket_host': '0.0.0.0',
            'server.socket_port': 1065,
            'server.thread_pool': 10,
            'server.thread_pool_max': -1,
            'JSON_AS_ASCII': False,
            'DEBUG': True,
            'loglevel': logging.WARNING,
    #         'environment': 'production'
    }
    dbConfig = {
           'type': 'MySql',
           'host': 'localhost',
           'user': 'kaspar',
           'pass': 'kaspar',
           'db': 'kaspar',
    }
    dbConfig = {
         'type': 'Sqlite',
         'file': os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../kaspar.db'))
    }


class ConsoleHandler(logging.StreamHandler):

    def __init__(self):
        super(ConsoleHandler, self).__init__()

    def emit(self, record):
        if record.levelno >= logging.WARNING:
            self.stream = sys.stderr
        else:
            self.stream = sys.stdout

        if not 'python' in record.pathname:
            return super(ConsoleHandler, self).emit(record)


def configureLogging(level=logging.NOTSET):
    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    logging.addLevelName(1, 'VERBOSE')
    if not [h for h in root_logger.handlers if isinstance(h, ConsoleHandler)]:
        # No stream handler found, add one
        streamHandler = logging.StreamHandler()
        streamHandler.setLevel(level)
        formatter = logging.Formatter("%(asctime)s %(levelname)s: %(name)s.%(funcName)s: %(message)s")
        streamHandler.setFormatter(formatter)
        root_logger.addHandler(streamHandler)
    if platform.system() == 'Linux':
        from logging.handlers import SysLogHandler as LogHandler
        kwargs = {'facility': LogHandler.LOG_LOCAL6, 'address': '/dev/log'}
    elif platform.system() == 'Windows':
        from logging.handlers import NTEventLogHandler as LogHandler
        kwargs = {'appname': 'KasparGUI'}
    if not [h for h in root_logger.handlers if isinstance(h, LogHandler)]:
        try:
            logHandler = LogHandler(**kwargs)
            logHandler.setLevel(level)
            formatter = logging.Formatter("%(asctime)s %(levelname)s: %(name)s.%(funcName)s: %(message)s")
            logHandler.setFormatter(formatter)
            root_logger.addHandler(logHandler)
        except:
            pass
    root_logger.info('Logging Configured')

