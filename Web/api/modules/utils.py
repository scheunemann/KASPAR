import datetime
from dateutil.tz import tzutc


class DateUtil(object):

    @staticmethod
    def fromUtcDateTime(dt):
        return datetime.datetime.strptime(dt, "%Y-%m-%dT%H:%M:%S.%fZ")

    @staticmethod
    def utcDateTime(dt=None):
        if dt == None:
            dt = datetime.datetime.now()
        if dt.tzinfo:
            dt = dt.astimezone(tzutc()).replace(tzinfo=None)
        return dt.isoformat() + 'Z'
