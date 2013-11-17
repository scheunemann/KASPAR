from Data.Model import Base
from Data.storage import StorageFactory


def _flushAndFillTestData():
    from config import dbConfig
    StorageFactory.config['engine'].update(dbConfig)
#     StorageFactory.config['debug'] = True
    StorageFactory.drop_keys(StorageFactory.getDefaultDataStore().engine)
    Base.metadata.drop_all(StorageFactory.getDefaultDataStore().engine)
    Base.metadata.create_all(StorageFactory.getDefaultDataStore().engine)

    from Data.Model import Operator, User, Sound, CustomAction, TimeTrigger, CustomTrigger, Pose, Sequence
    from Config.legacy import loadAllConfigs
    o = Operator('oNathan', 'oNathan Burke')
    o.password = '1234'

    u = User('uNathan', 'uNathan Burke')
    o.users.append(u)
# 
#     s = Sound('aSound')
#     cs = Sound('cSound')
#     ca = CustomAction()
#     ca.overridden = s
#     ca.redirect = cs
#     u.customActions.append(ca)
# 
#     p = Pose('aPose')
#     cp = Pose('cPose')
#     ca = CustomAction('Custom_Pose')
#     ca.overridden = p
#     ca.redirect = cp
#     u.customActions.append(ca)
# 
#     t = TimeTrigger('tTime')
#     ct = TimeTrigger('cTime')
#     ctr = CustomTrigger('Custom_Time')
#     ctr.overridden = t
#     ctr.redirect = ct
#     u.customTriggers.append(ctr)
# 
#     sq = Sequence('aSequence')
#     sq.actions.append(s)
#     sq.actions.append(p)

    (robots, poses, triggers) = loadAllConfigs()

    session = StorageFactory.getNewSession()
    session.add_all(robots)
    session.add_all(poses)
    session.add_all(triggers)
#     session.add(sq)
    session.add(o)
    session.commit()

if __name__ == "__main__":
    _flushAndFillTestData()
