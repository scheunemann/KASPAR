import logging
import sys

webConfig = {
        'server.socket_host': '0.0.0.0',
        'server.socket_port': 1065,
        'server.thread_pool': 10,
        'server.thread_pool_max':-1,
        'JSON_AS_ASCII': False,
        'DEBUG': True,
#         'environment': 'production'
}

dbConfig = {
        'type': 'MySql',
        'host': 'localhost',
        'user': 'kaspar',
        'pass': 'kaspar',
        'db': 'kaspar',
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
    root_logger.setLevel(0)
    logging.addLevelName(1, 'VERBOSE')
    if not [h for h in root_logger.handlers if isinstance(h, ConsoleHandler)]:
        # No stream handler found, add one
        streamHandler = logging.StreamHandler()
        streamHandler.setLevel(level)
        formatter = logging.Formatter("%(asctime)s %(levelname)s: %(name)s.%(funcName)s: %(message)s")
        streamHandler.setFormatter(formatter)
        root_logger.addHandler(streamHandler)

