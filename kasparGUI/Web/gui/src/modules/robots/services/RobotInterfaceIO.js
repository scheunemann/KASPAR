'use strict';

define(function(require) {
        var angular = require('angular');
        var io = require('socketio');

        var Sensor = function() {
            return {
                id: null,
                name: null,
                value: null,
            };
        };

        var Servo = function() {
            return {
                id: null,
                $actual: {
                    position: null,
                    poseable: null
                },
                poseable: null,
                position: null,
                speed: null,
                jointName: null,
            };
        };

        var RobotInterface = function($rootScope) {
            var robotSocket = io.connect('/Robot/Interface', {
                    resource: 'api/socket.io'
                });
            var self = this;
            var saving = false;
            var delayedSave = null;
            var connected = false;
            var robotId = null;
            var components = {
                servos: {},
                sensors: {},
                id: null,
                timestamp: null,
            };

            var on = function(eventName, callback) {
                robotSocket.on(eventName, function() {
                        var args = arguments;
                        $rootScope.$apply(function() {
                                var json = args[0];
                                var obj = angular.fromJson(json);
                                callback.apply(robotSocket, [obj]);
                            });
                    });
            };

            var emit = function(eventName, data, callback) {
                robotSocket.emit(eventName, data, function() {
                        var args = arguments;
                        $rootScope.$apply(function() {
                                if (callback) {
                                    var json = args[0];
                                    var obj = angular.fromJson(json);
                                    callback.apply(robotSocket, [obj]);
                                }
                            });
                    });
            };

            var sendChanges = function(newValue, oldValue) {
                var servos = [];
                // Watcher is on the top level array, filter to only changed servos
                for (var servoName in newValue) {
                    var servo = newValue[servoName];
                    if (true || oldValue === undefined || oldValue === null || oldValue[servoName] === undefined ||
                        servo.position !== oldValue[servoName].position || servo.poseable !== oldValue[servoName].poseable) {
                        //console.log(servo);
                        servos.push({
                                id: servo.id,
                                position: servo.position,
                                poseable: servo.poseable,
                                speed: servo.speed,
                                jointName: servoName,
                            });
                    }
                }

                if (robotId === null || !connected) {
                    return;
                }

                //console.log(servos);
                if (servos.length > 0) {
                    // Prevents flooding the server (which ends up queueing the requests)
                    save({
                            id: robotId,
                            servos: servos,
                        });
                }
            };

            var save = function(data) {
                if (saving) {
                    //console.log("Queueing action for later: " + data);
                    delayedSave = data;
                } else {
                    //console.log("Sending data: ");
                    //console.log(data);
                    saving = true;
                    emit('setData', data, function() {
                            saving = false;
                            if (delayedSave !== null) {
                                var next = delayedSave;
                                delayedSave = null;
                                save(next);
                            }
                        });
                }
            };

            on('getData', function(dataPackage) {
                    if (!connected) {
                        return;
                    }
                    //console.log(dataPackage);

                    for (var servoIndex = 0; servoIndex < dataPackage.servos.length; servoIndex++) {
                        var servo = dataPackage.servos[servoIndex];
                        if (components.servos[servo.jointName] === undefined) {
                            components.servos[servo.jointName] = new Servo();
                            components.servos[servo.jointName].jointName = servo.jointName;
                        }

                        components.servos[servo.jointName].id = servo.id;
                        components.servos[servo.jointName].$actual.position = servo.value;
                        components.servos[servo.jointName].$actual.poseable = servo.poseable;
                    }

                    for (var sensorIndex = 0; sensorIndex < dataPackage.sensors.length; sensorIndex++) {
                        var sensor = dataPackage.sensors[sensorIndex];
                        if (components.sensors[sensor.name] === undefined) {
                            components.sensors[sensor.name] = new Sensor();
                            components.sensors[sensor.name].name = sensor.name;
                        }

                        components.sensors[sensor.name].id = sensor.id;
                        components.sensors[sensor.name].value = sensor.value;
                    }
                });

            $rootScope.$watch(function() {
                    return components.servos;
                }, sendChanges, true);

            this.setRobot = function(robot) {
                if (robot === undefined || robot === null && robotId !== null) {
                    this.setConnected(false);
                    robotId = null;
                    return;
                }

                if (robot.id != robotId) {
                    this.setConnected(false);
                    robotId = robot.id;
                    this.setConnected(true);
                }
            };

            this.setConnected = function(connectedState) {
                if (connected != connectedState) {
                    connected = connectedState;
                    robotSocket.emit('configure', {
                            robotId: robotId,
                            connect: connected
                        });
                }
            };

            this.getConnected = function() {
                return connected;
            };

            this.getSensor = function(sensorName) {
                if (sensorName === undefined) {
                    return null;
                }

                if (components.sensors[sensorName] === undefined) {
                    components.sensors[sensorName] = new Sensor();
                    components.sensors[sensorName].name = sensorName;
                }

                return components.sensors[sensorName];
            };

            this.getServo = function(componentName) {
                if (componentName === undefined) {
                    return null;
                }

                if (components.servos[componentName] === undefined) {
                    var component = new Servo();
                    component.jointName = componentName;
                    components.servos[componentName] = component;
                }

                return components.servos[componentName];
            };
        };

        return ['$rootScope', RobotInterface];
    });
