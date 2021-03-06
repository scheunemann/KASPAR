'use strict';

define(function(require) {
        var enGb = {
            'action.label': 'Action',
            'action.select.prompt': '--Select Action--',
            'action.test': 'Test',
            'action.stop': 'Stop',
            'action.import.selectFiles': 'Select Files',
            'action.import.upload': 'Upload',
            'action.new': 'New',
            'action.delete': 'Delete',
            'action.type.label': 'Type',
            'action.type.select.prompt': '--Select Type--',
            'action.sound.name': 'Name',
            'action.sound.selectFile': 'Select File',
            'action.sound.selectedFile': 'Selected File',
            'action.sound.upload': 'Upload',
            'action.sequence.name': 'Name',
            'action.sequence.actions.list.label': 'All Behaviours',
            'action.sequence.actions.add': 'Add',
            'action.sequence.actions.remove': 'Remove',
            'action.sequence.actions.moveUp': 'Move Up',
            'action.sequence.actions.moveDown': 'Move Down',
            'action.sequence.actions.title': 'Sequence Behaviours',
            'action.sequence.help.short': 'All selected behaviours will attempt execute in order',
            'action.pose.name': 'Name',
            'action.pose.type.prompt': 'Select pose entry mode',
            'action.pose.basic.label': 'Basic',
            'action.pose.basic.locked': 'Release group servos',
            'action.pose.basic.poseable': 'Lock group servos',
            'action.pose.advanced.label': 'Detailed',
            'action.pose.speedModifier': 'Speed Modifier',
            'action.pose.speedModifier.short': 'Speed',
            'action.pose.minLength': 'Minimum Length',
            'action.pose.minLength.short': 'Length',
            'action.pose.minLength.units': 'seconds',
            'action.pose.joint.name': 'Joint',
            'action.pose.joint.select.prompt': '--Select Joint--',
            'action.pose.joint.delete': 'Remove',
            'action.pose.joint.locked': 'Release',
            'action.pose.joint.poseable': 'Lock',
            'action.pose.joint.position': 'Position',
            'action.pose.joint.speed': 'Speed',
            'action.group.name': 'Name',
            'action.group.actions.list.label': 'All Behaviours',
            'action.group.actions.add': 'Add',
            'action.group.actions.remove': 'Remove',
            'action.group.actions.title': 'Group Behaviours',
            'action.group.help.short': 'All selected behaviours will attempt to execute simultaneously',
            'common.setting.robot.label': 'Attached Robot',
            'common.setting.robot.select.prompt': '--Select Robot--',
            'interaction.operator.label': 'Operator',
            'interaction.operator.select.prompt': '--Select Operator--',
            'interaction.user.label': 'User',
            'interaction.user.select.prompt': '--Select User--',
            'interaction.start': 'Start',
            'interaction.stop': 'Stop',
            'interaction.operator.view.buttons.label': 'User Buttons',
            'interaction.operator.view.activateBindings': 'Activate Bindings',
            'interaction.operator.view.showHotkeys': 'Show Hotkeys',
            'operator.label': 'Operator',
            'operator.select.prompt': '--Select Operator--',
            'operator.new': 'New',
            'operator.delete': 'Delete',
            'operator.name': 'Name',
            'operator.users': 'Common Users',
            'robot.label': 'Robot',
            'robot.select.prompt': '--Select Robot--',
            'robot.new': 'New',
            'robot.delete': 'Delete',
            'robot.view.servoModel.label': 'Servo Model Configs',
            'robot.view.servoModel.id': 'Servo Model Id',
            'robot.view.servoModel.port': 'Port',
            'robot.view.servoModel.portSpeed': 'Port Speed',
            'robot.view.servoModel.position.scale': 'Position Scale',
            'robot.view.servoModel.position.offset': 'Position Offset',
            'robot.view.servoModel.position.min': 'Min Position',
            'robot.view.servoModel.position.max': 'Max Position',
            'robot.view.servoModel.position.default': 'Default Position',
            'robot.view.servoModel.speed.scale': 'Speed Scale',
            'robot.view.servoModel.speed.min': 'Min Speed',
            'robot.view.servoModel.speed.max': 'Max Speed',
            'robot.view.servoModel.speed.default': 'Default Speed',
            'robot.view.servoModel.poseable': 'Poseable',
            'robot.view.servoModel.otherSettings': 'Other',
            'robot.view.servoGroups.label': 'Servo Groups',
            'robot.view.servoGroups.servoName': 'Servo Name',
            'robot.view.servos.label': 'Servos',
            'robot.view.servos.model.id': 'Servo Model Id',
            'robot.view.servos.position.scale': 'Position Scale',
            'robot.view.servos.position.offset': 'Position Offset',
            'robot.view.servos.position.min': 'Min Position',
            'robot.view.servos.position.max': 'Max Position',
            'robot.view.servos.position.default': 'Default Position',
            'robot.view.servos.speed.scale': 'Speed Scale',
            'robot.view.servos.speed.min': 'Min Speed',
            'robot.view.servos.speed.max': 'Max Speed',
            'robot.view.servos.speed.default': 'Default Speed',
            'robot.view.servos.poseable': 'Poseable',
            'robot.view.servos.otherSettings': 'Other',
            'robot.interface.robot': 'Attached Robot',
            'robot.interface.robot.short': 'Robot',
            'robot.interface.robot.select.prompt': '--Select Robot--',
            'robot.interface.connect': 'Connect',
            'robot.interface.disconnect': 'Disconnect',
            'robot.name': 'Name',
            'robot.model': 'Model',
            'robot.model.select.prompt': '--Select Model--',
            'robot.version': 'Version',
            'game.label': 'Play Scenario',
            'trigger.import.selectFiles': 'Select Files',
            'trigger.import.upload': 'Upload',
            'trigger.label': 'Trigger',
            'trigger.select.prompt': '--Select Trigger--',
            'trigger.new': 'New',
            'trigger.delete': 'Delete',
            'trigger.type.label': 'Type',
            'trigger.type.select.prompt': '--Select Type--',
            'trigger.time.name': 'Name',
            'trigger.time.action': 'Action',
            'trigger.time.action.select.prompt': 'No Action',
            'trigger.time.trigger': 'Trigger',
            'trigger.time.trigger.select.prompt': '--Select Trigger--',
            'trigger.time.time': 'Time',
            'trigger.time.time.while': 'While Active',
            'trigger.time.time.since': 'Since Deactivated',
            'trigger.time.time.units': 'seconds',
            'trigger.sensor.connect': 'Connect',
            'trigger.sensor.disconnect': 'Disconnect',
            'trigger.sensor.current': 'Current',
            'trigger.sensor.basic.label': 'Basic',
            'trigger.sensor.basic.on': 'Active',
            'trigger.sensor.basic.off': 'Inactive',
            'trigger.sensor.basic.help.short': 'As determined by sensor type',
            'trigger.sensor.advanced.label': 'Detailed',
            'trigger.sensor.advanced.compare.label': 'Active when current value',
            'trigger.sensor.advanced.compare.select.prompt': '--Select Value--',
            'trigger.sensor.name': 'Name',
            'trigger.sensor.action': 'Action',
            'trigger.sensor.action.select.prompt': 'No Action',
            'trigger.sensor.sensor': 'Sensor',
            'trigger.sensor.sensor.select.prompt': '--Select Sensor--',
            'trigger.button.hotkey.label': 'Keyboard Button',
            'trigger.button.hotkey.delete': 'Delete',
            'trigger.button.hotkey.new': 'New Keyboard Button',
            'trigger.button.name': 'Name',
            'trigger.button.action': 'Action',
            'trigger.button.action.select.prompt': 'No Action',
            'trigger.compound.name': 'Name',
            'trigger.compound.action': 'Action',
            'trigger.compound.action.select.prompt': 'No Action',
            'trigger.compound.require.label': 'Require',
            'trigger.compound.require.all': 'all',
            'trigger.compound.require.any': 'any',
            'trigger.compound.require.trigger': 'selected triggers',
            'trigger.compound.triggers.list.label': 'All Triggers',
            'trigger.compound.triggers.add': 'Add',
            'trigger.compound.triggers.remove': 'Remove',
            'trigger.compound.triggers.title': 'Selected Triggers',
            'user.label': 'User',
            'user.select.prompt': '--Select User--',
            'user.new': 'New',
            'user.delete': 'Delete',
            'user.name': 'Name',
            'user.speedModifier': 'Movement Speed',
            'user.custom.action.label': 'Custom Behaviours',
            'user.custom.action.new': 'New',
            'user.custom.action.delete': 'Delete',
            'user.custom.action.override': 'Action to Override',
            'user.custom.action.redirect': 'Override Action',
            'user.custom.trigger.label': 'Custom Triggers',
            'user.custom.trigger.new': 'New',
            'user.custom.trigger.delete': 'Delete',
            'navbar.admin.label': 'Admin',
            'navbar.admin.operators': 'Operators',
            'navbar.admin.users': 'Users',
            'navbar.admin.robots': 'Robots',
            'navbar.admin.settings': 'Settings',
            'navbar.action.label': 'Action',
            'navbar.action.edit': 'Create/Edit',
            'navbar.action.test': 'Test',
            'navbar.action.import': 'Import',
            'navbar.trigger.label': 'Trigger',
            'navbar.trigger.edit': 'Create/Edit',
            'navbar.trigger.test': 'Test',
            'navbar.trigger.import': 'Import',
            'navbar.game.label': 'Play Scenario',
            'navbar.game.edit': 'Create/Edit',
            'navbar.game.test': 'Test',
            'navbar.game.import': 'Import',
            'navbar.interaction.label': 'Interactions',
            'navbar.interaction.view': 'View History',
            'navbar.interaction.begin': 'Begin New',
            'navbar.interaction.manage': 'Manage History',
        };

        return enGb;
    });
