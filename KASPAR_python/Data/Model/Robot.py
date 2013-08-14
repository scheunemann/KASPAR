from Base import StandardMixin, Base
from sqlalchemy import Column, String, Float, Integer, ForeignKey

class Robot(StandardMixin, Base):
    name = Column(String(50))
    version = Column(String(50))

    def __init__(self, name=None, version=None):
        super(Robot, self).__init__()
        self.name = name
        self.version = version
