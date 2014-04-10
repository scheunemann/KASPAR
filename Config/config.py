import logging
import sys

webConfig = {
        'server.socket_host': '0.0.0.0',
        'server.socket_port': 1065,
        'server.thread_pool': 10,
        'server.thread_pool_max': -1,
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


class StreamHandler(logging.StreamHandler):

    def __init__(self):
        super(StreamHandler, self).__init__()

    def emit(self, record):
        if record.levelno >= logging.WARNING:
            self.stream = sys.stderr
        else:
            self.stream = sys.stdout

        if not 'python' in record.pathname:
            return super(StreamHandler, self).emit(record)


def configureLogging(level=None):
    root_logger = logging.getLogger()
    if not [h for h in root_logger.handlers if isinstance(h, StreamHandler)]:
        if level == None:
            level = logging.WARNING

        logging.addLevelName(1, 'VERBOSE')

        formatter = logging.Formatter("%(asctime)s %(levelname)s: %(name)s.%(funcName)s: %(message)s")

        streamHandler = StreamHandler()
        streamHandler.setFormatter(formatter)

    #     infoHandler = logging.StreamHandler(stream=sys.stdout)
    #     infoHandler.setLevel(level=logging.INFO)
    #     infoHandler.setFormatter(formatter)
    #
    #     criticalHandler = logging.StreamHandler(stream=sys.stderr)
    #     criticalHandler.setLevel(level=logging.WARNING)
    #     criticalHandler.setFormatter(formatter)

    #     root_logger.addHandler(criticalHandler)
    #     root_logger.addHandler(infoHandler)
        root_logger.addHandler(streamHandler)
        root_logger.setLevel(level)
