import datetime


class DateUtil(object):

    @staticmethod
    def fromUtcDateTime(dt):
        try:
            return datetime.datetime.strptime(dt, "%Y-%m-%dT%H:%M:%S.%f")
        except ValueError:
            return datetime.datetime.strptime(dt, "%Y-%m-%dT%H:%M:%S")
