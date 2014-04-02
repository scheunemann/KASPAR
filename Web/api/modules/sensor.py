import Model

models = [
          {'class': Model.SensorModel, },
          {
            'class': Model.SensorValueType,
            'kwargs': {
                       'methods':['GET'],
                       'include_columns': ['id', 'type']
                       }
          },
          {'class': Model.DiscreteValueType, 'kwargs': {'methods':['GET'], }},
          {'class': Model.ContinuousValueType, 'kwargs': {'methods':['GET'], }},
          {'class': Model.Sensor, 'kwargs': {'include_columns': ['id', 'name', 'type']}},
          {'class': Model.RobotSensor, },
          {'class': Model.ExternalSensor, },
          {'class': Model.SensorGroup, },
          {'class': Model.SensorConfig, },
         ]


blueprints = []
