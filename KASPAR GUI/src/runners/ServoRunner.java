/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package runners;

import data.Robot;
import data.Servo;
import data.ServoConfig;
import data.ServoPosition;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import gui.GuiLogger;
import managers.ServoManager;
import managers.SessionManager;
import servos.AX12;
import servos.dynamixel.AX12Connection;
import servos.dynamixel.AX12SyncPacket;

/**
 *
 * @author nathan
 */
public class ServoRunner {

    private List<ServoPosition> ax12Servos = new ArrayList<ServoPosition>();
    private List<ServoPosition> otherServos = new ArrayList<ServoPosition>();
    private Map<String, Servo> hardwareServos = new HashMap<String, Servo>();
    private Robot robot;

    public ServoRunner(Robot robot) {
        this.robot = robot;
    }

    public void prepare(ServoPosition sPos) {
        Servo servo = getServo(sPos);

        if ("AX12".equals(servo.getServoType().getName())) {
            ax12Servos.add(sPos);
        } else {
            otherServos.add(sPos);
        }

    }

    public void enableManualPositioning(Servo... servos) {
        // Perpare the syncPackets for manual positioning if necessary
        AX12SyncPacket torqueOffPacket = new AX12SyncPacket("TORQUE_ENABLE", 1);
        addServos(servos, torqueOffPacket, 0);
        ServoConfig config = SessionManager.getServoConfig(robot, "AX12");
        AX12Connection.getConnection(config.getPort(), config.getPortSpeed()).send(torqueOffPacket);
    }

    public void disableManualPositioning(Servo... servos) {
        // Perpare the syncPackets for manual positioning if necessary
        AX12SyncPacket torqueOnPacket = new AX12SyncPacket("TORQUE_ENABLE", 1);
        addServos(servos, torqueOnPacket, 1);
        ServoConfig config = SessionManager.getServoConfig(robot, "AX12");
        AX12Connection.getConnection(config.getPort(), config.getPortSpeed()).send(torqueOnPacket);
    }

    private void addServos(Servo[] servos, AX12SyncPacket torqueOffPacket, int value) {
        for (Servo s : servos) {
            if (s.getServoType().isPositionable()) {
                // We only know how to handle AX12 for now
                if ("AX12".equals(s.getServoType().getName())) {
                    AX12 servo = (AX12) ServoManager.getServo(robot, s);
                    torqueOffPacket.add(servo, new int[]{value});
                } else {
                    GuiLogger.getLogger().log(Level.WARNING, "Manual positioning for {0} is not implimented", s.getName());
                }
            } else {
                GuiLogger.getLogger().log(Level.WARNING, "Servo does not support manual positioning: {0}", s.getName());
            }
        }
    }

    public void clearPrepared() {
        ax12Servos.clear();
        otherServos.clear();
    }

    public void runPrepared() {
        for (ServoPosition sPos : otherServos) {
            servos.Servo s = ServoManager.getServo(this.robot, this.getServo(sPos));
            s.setPosition(sPos.getPosition(), sPos.getSpeed());
        }

        if (!ax12Servos.isEmpty()) {
            // And now send packet to all AX12 servos simultaneously
            // Create new SyncPacket with start address GOAL_POSITION and write position and speed at once
            AX12SyncPacket syncPacket = new AX12SyncPacket(
                    "GOAL_POSITION",
                    AX12.getParamLength("GOAL_POSITION") + AX12.getParamLength("MOVING_SPEED"));

            for (ServoPosition sPos : ax12Servos) {
                servos.Servo s = ServoManager.getServo(this.robot, this.getServo(sPos));
                syncPacket.add((AX12) s, sPos.getPosition(), sPos.getSpeed());
            }

            ServoConfig config = SessionManager.getServoConfig(robot, "AX12");
            AX12Connection.getConnection(config.getPort(), config.getPortSpeed()).send(syncPacket);
        }
    }

    private Servo getServo(ServoPosition sPos) {
        Servo servo;
        if (!this.hardwareServos.containsKey(sPos.getServoName())) {
            this.hardwareServos.put(sPos.getServoName(), SessionManager.getServo(this.robot, sPos.getServoName()));
        }
        servo = this.hardwareServos.get(sPos.getServoName());
        return servo;
    }
}
