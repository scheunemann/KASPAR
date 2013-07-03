from Base import StandardMixin, BaseClass
from sqlalchemy import Column, String

class Robot(StandardMixin, BaseClass):
    name = Column(String(50))
    version = Column(String(50))

    def __init__(self, name, version):
        self.name = name
        self.version = version
        
