define(["require"],function(){var Sensor=function(){return{id:null,name:null,value:null}},Servo=function(){return{id:null,actual:{position:null,poseable:null},poseable:null,position:null,jointName:null}},RobotInterface=function($q,$timeout,$rootScope,RobotInterface){var connected=!0,robotId=null,delayedSave=null,saving=!1,components={servos:{},sensors:{},id:null,timestamp:null},sendChanges=function(newValue,oldValue){if(null!==robotId&&connected){if(saving)return void(delayedSave=newValue);var servos=[];for(var servoName in newValue){var servo=newValue[servoName];(void 0===oldValue||void 0===oldValue[servoName]||servo.position!=oldValue[servoName].position||servo.poseable!=oldValue[servoName].poseable)&&servos.push({id:servo.id,position:servo.position,poseable:servo.poseable,jointName:servoName})}if(servos.length>0){var packet={servos:servos};saving=!0;var save=RobotInterface.save({id:robotId},packet);save.$promise.then(function(){if(saving=!1,null!==delayedSave){var ds=delayedSave;delayedSave=null,sendChanges(ds)}})}else if(null!==delayedSave){var ds=delayedSave;delayedSave=null,sendChanges(ds)}}},updateStatus=function(lastUpdateTime){if(connected){var status=RobotInterface.get(void 0===lastUpdateTime?{id:robotId}:{id:robotId,timestamp:lastUpdateTime});status.$promise.then(processUpdate).then(updateStatus)}},processUpdate=function(dataPackage){for(var servoIndex=0;servoIndex<dataPackage.servos.length;servoIndex++){var servo=dataPackage.servos[servoIndex];void 0===components.servos[servo.jointName]&&(components.servos[servo.jointName]=new Servo,components.servos[servo.jointName].jointName=servo.jointName),components.servos[servo.jointName].id=servo.id,components.servos[servo.jointName].actual.position=servo.position,components.servos[servo.jointName].actual.poseable=servo.poseable}for(var sensorIndex=0;sensorIndex<dataPackage.sensors.length;sensorIndex++){var sensor=dataPackage.sensors[sensorIndex];void 0===components.sensors[sensor.name]&&(components.sensors[sensor.name]=new Sensor,components.sensors[sensor.name].name=sensor.name),components.sensors[sensor.name].id=sensor.id,components.sensors[sensor.name].value=sensor.value}return $rootScope.$$phase||$rootScope.$digest(),dataPackage.timestamp};$rootScope.$watch(function(){return components.servos},sendChanges,!0),this.setRobot=function(robot){if(void 0===robot||null===robot&&null!==robotId)return this.setConnected(!1),void(robotId=null);if(robot.id!=robotId){var connected=this.connected;this.setConnected(!1),robotId=robot.id,this.setConnected(connected)}},this.setConnected=function(connectedState){connected=connectedState,connected&&updateStatus()},this.getSensor=function(sensorName){return void 0===sensorName?null:(void 0===components.sensors[sensorName]&&(components.sensors[sensorName]=new Sensor,components.sensors[sensorName].name=sensorName),components.sensors[sensorName])},this.getServo=function(componentName){return void 0===componentName?null:(void 0===components.servos[componentName]&&(components.servos[componentName]=new Servo,components.servos[componentName].jointName=componentName),components.servos[componentName])}};return["$q","$timeout","$rootScope","RobotInterface",RobotInterface]});
//# sourceMappingURL=RobotInterface.js.map