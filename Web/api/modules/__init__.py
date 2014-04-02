blueprints = []
models = []

import action
models.extend(action.models)
blueprints.extend(action.blueprints)

import interaction
models.extend(interaction.models)
blueprints.extend(interaction.blueprints)

import menu
models.extend(menu.models)
blueprints.extend(menu.blueprints)

import operator
models.extend(operator.models)
blueprints.extend(operator.blueprints)

import robot
models.extend(robot.models)
blueprints.extend(robot.blueprints)

import sensor
models.extend(sensor.models)
blueprints.extend(sensor.blueprints)

import settings
models.extend(settings.models)
blueprints.extend(settings.blueprints)

import trigger
models.extend(trigger.models)
blueprints.extend(trigger.blueprints)

import user
models.extend(user.models)
blueprints.extend(user.blueprints)
