/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package managers;

import data.Robot;
import data.Servo;
import data.ServoConfig;
import data.ServoGroup;
import gui.GuiLogger;
import java.util.logging.Level;
import java.util.logging.Logger;
import runners.PoseRunner;
import servos.AX12;
import servos.MiniSSC;
import servos.SSC32;

/**
 *
 * @author nathan
 */
public class ServoManager {

//    /**
//     * Prepares for the execution of the servo commands. For AX12 servos, the
//     * command is send and stored in the servo but not yet executed. For SSC32
//     * servos the command is buffered locally and only sent when
//     * {@link #executePrepared()} is called since these servos don't support
//     * buffering of commands.
//     *
//     * @see Servos#executeCommands()
//     * @see AX12Servo#delayPosition(int, int)
//     * @see ServoSSC32#delayPosition(int, int)
//     */
//    public void prepare(Pose pose) {
//        for (data.ServoPosition sPos : pose.getServoPositions()) {
//            sPos.prepare();
//        }
//    }
//
//    /**
//     * Send command to all servos to execute delayed actions
//     *
//     * @see Servos#executeCommands()
//     */
//    public void executePrepared() {
//        Servos.executeCommands();
//    }
    public static boolean allServosReady(Robot robot) {
        for (ServoGroup sg : robot.getServoGroups()) {
            for (Servo s : sg.getServos()) {
                if (!getServo(robot, s).isReady()) {
                    return false;
                }
            }
        }

        return true;
    }

    public static boolean allServosAvailable(Robot robot) {

        boolean yes = true;
        for (ServoGroup sg : robot.getServoGroups()) {
            for (Servo servo : sg.getServos()) {

                servos.Servo s = getServo(robot, servo);
                if (!s.isConnected()) {
                    return false;
                }

                if (!s.ping()) {
                    GuiLogger.getLogger().log(Level.INFO, "Servo {0} does not answer to ping", servo.getName());
                    yes = false;
                }
            }
        }
        if (yes) {
            GuiLogger.getLogger().info("All servos there and ready");
        } else {
            GuiLogger.getLogger().warning(
                    "Some servos did not answer to ping! Please check connection to Kaspar or the definitions file!");
        }
        return yes;
    }

    public static void initialiseAllServos(Robot robot) {
        for (ServoGroup sg : robot.getServoGroups()) {
            for (Servo s : sg.getServos()) {
                getServo(robot, s).init();
            }
        }
    }

    public static servos.Servo getServo(Robot robot, Servo servo) {
        servos.Servo s;
        ServoConfig config = SessionManager.getServoConfig(robot, servo.getServoType().getName());
        if ("SSC32".equals(servo.getServoType().getName())) {
            s = new SSC32(
                    config.getPort(),
                    config.getPortSpeed(),
                    servo.getExternalId(),
                    servo.getMinPosition(),
                    servo.getMaxPosition(),
                    servo.getDefaultPosition(),
                    config.getAbstractToRealPositionFactor(),
                    servo.getMinSpeed(),
                    servo.getMaxSpeed(),
                    servo.getDefaultSpeed(),
                    config.getAbstractToRealSpeedFactor(),
                    servo.getServoType().getPositionError());
        } else if ("MINISSC".equals(servo.getServoType().getName())) {
            s = new MiniSSC(
                    config.getPort(),
                    config.getPortSpeed(),
                    servo.getExternalId(),
                    servo.getMinPosition(),
                    servo.getMaxPosition(),
                    servo.getDefaultPosition(),
                    config.getAbstractToRealPositionFactor());
        } else if ("AX12".equals(servo.getServoType().getName())) {
            s = new AX12(
                    config.getPort(),
                    config.getPortSpeed(),
                    servo.getExternalId(),
                    servo.getMinPosition(),
                    servo.getMaxPosition(),
                    servo.getDefaultPosition(),
                    config.getAbstractToRealPositionFactor(),
                    servo.getMinSpeed(),
                    servo.getMaxSpeed(),
                    servo.getDefaultSpeed(),
                    config.getAbstractToRealSpeedFactor(),
                    servo.getServoType().getPositionError(),
                    servo.getServoType().getCycleError(),
                    servo.getServoType().getCyclesUntilReact());
        } else {
            Logger.getLogger(PoseRunner.class
                    .getName()).log(
                    Level.SEVERE,
                    "Could not determine servo type for " + servo.toString(),
                    servo);

            return null;
        }

        return s;
    }
}
