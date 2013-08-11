from Base import StandardMixin, Base
from sqlalchemy import Column, String, Float

class Robot(StandardMixin, Base):
    name = Column(String(50))
    version = Column(String(50))

    def __init__(self, name=None, version=None):
        super(Robot, self).__init__()
        self.name = name
        self.version = version
        
class Joint(StandardMixin, Base):
    
    name = Column(String(50))
    angle = Column(Float())
    
    def __init__(self, name=None):
        super(Joint, self).__init__()
        self.name = name