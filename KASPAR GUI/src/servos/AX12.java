/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package servos;

import gui.GuiLogger;
import java.util.HashMap;
import java.util.logging.Level;
import managers.SessionManager;
import servos.dynamixel.AX12Connection;
import servos.dynamixel.AX12Packet;
import servos.dynamixel.AX12RxPacket;
import servos.dynamixel.AX12TxPacket;

/**
 *
 * @author Sven
 */
public class AX12 extends Servo {
        private static final long serialVersionUID = 37468324L;

    // Construct to hold all address we can use for one servo
    private final static HashMap<String, AX12Address> addresses = new HashMap<String, AX12Address>() {

        // Initialisation block
        {
            put("GOAL_POSITION", new AX12Address("GOAL_POSITION", 0x1E, 2));
            put("PRESENT_POSITION", new AX12Address("PRESENT_POSITION", 0x24, 2));
            put("PRESENT_POSITION", new AX12Address("PRESENT_POSITION", 0x24, 2));
            put("CW_ANGLE_LIMIT", new AX12Address("CW_ANGLE_LIMIT", 0x06, 2));
            put("CCW_ANGLE_LIMIT", new AX12Address("CCW_ANGLE_LIMIT", 0x08, 2));
            put("MOVING_SPEED", new AX12Address("MOVING_SPEED", 0x20, 2));
            put("PRESENT_SPEED", new AX12Address("PRESENT_SPEED", 0x26, 2));
            put("TORQUE_LIMIT", new AX12Address("TORQUE_LIMIT", 0x22, 2));
            put("PRESENT_LOAD", new AX12Address("PRESENT_LOAD", 0x28, 2));
            put("MOVING", new AX12Address("MOVING", 0x2E, 1));
            put("TORQUE_ENABLE", new AX12Address("TORQUE_ENABLE", 0x18, 1));
        }
    };
    private final static int minVoltage = 100; // Voltage is represented as 10*real voltage
    private int goalPosition;
    private int presentLoad;
    private boolean reactive;
    private int loadConstant;
    private int constantCounter;
    private int posError = 0;
    private int cycleError = 0;
    private int cyclesUntilReact = 0;
    private static AX12Connection conn = null;

    public int getExternalId() {
        return this.externalId;
    }

    /**
     * Structure to hold one servo address and name it
     */
    private static class AX12Address {

        protected String name;
        protected int addr;
        protected int length;

        public AX12Address(String name, int addr, int length) {
            this.name = name;
            this.addr = addr;
            this.length = length;
        }
    }

    public AX12(
            String port,
            int portSpeed,
            int externalId,
            int minPos,
            int maxPos,
            int defaultPos,
            double posScaleValue,
            int minSpeed,
            int maxSpeed,
            int defaultSpeed,
            double speedScaleValue,
            int positionError,
            int cycleError,
            int cyclesUntilReact) {
        super(
                port,
                portSpeed,
                externalId,
                minPos,
                maxPos,
                defaultPos,
                posScaleValue,
                minSpeed,
                maxSpeed,
                defaultSpeed,
                speedScaleValue);

        this.posError = positionError;
        this.cycleError = cycleError;
        this.cyclesUntilReact = cyclesUntilReact;

        if (conn == null) {
            conn = AX12Connection.getConnection(port, portSpeed);
        }

        if (conn.isOpen()) {
            checkMinMaxValues();
        }
        reactive = false;

    }

    public AX12(
            String port,
            int portSpeed,
            int externalId,
            int minPos,
            int maxPos,
            int defaultPos,
            int defaultSpeed,
            int positionError,
            int cycleError,
            int cyclesUntilReact) {
        this(
                port,
                portSpeed,
                externalId,
                minPos,
                maxPos,
                defaultPos,
                1,
                0,
                1023,
                defaultSpeed,
                1,
                positionError,
                cycleError,
                cyclesUntilReact);
    }

    public AX12(
            String port,
            int portSpeed,
            int externalId,
            int defaultPos,
            int defaultSpeed,
            int positionError,
            int cycleError,
            int cyclesUntilReact) {
        this(
                port,
                portSpeed,
                externalId,
                0,
                1023,
                defaultPos,
                1,
                0,
                1023,
                defaultSpeed,
                1,
                positionError,
                cycleError,
                cyclesUntilReact);
    }

    public int getGoalPosition() {
        return goalPosition;
    }

    public int getPresentLoad() {
        return presentLoad;
    }

    public void setReactive(boolean r) {
        reactive = r;
    }

    /**
     * Get the address of a given servo parameter
     *
     * @param param Parameter name to look up
     * @return Starting address of parameter
     */
    public static int getParamAddress(String param) {
        return addresses.get(param).addr;
    }

    /**
     * Get the length in bytes of a given servo parameter
     *
     * @param param Parameter name to look up
     * @return Length of parameter (in number of bytes)
     */
    public static int getParamLength(String param) {
        return addresses.get(param).length;
    }

    /**
     * Request current position from servo
     *
     * @return Current position of servo scaled to [0, scale]
     */
    @Override
    public int getPosition() {

        int old = targetPosition;

        int motorValue;
        if (!SessionManager.getDebugMode()) {
            motorValue = getValue("PRESENT_POSITION");
        } else {
            motorValue = defaultPos;
        }

        if (motorValue > maxPos || motorValue < minPos) {
            GuiLogger.getLogger().log(Level.SEVERE, "AX12Motor {0} reported value outside limits ''[{1},{2}'']: {3}", new Object[]{externalId, minPos, maxPos, motorValue});
        }

        // Get present position from motor and scale it to [0,scale]
        targetPosition = realToScalePos(motorValue);

        // Inform listeners
        propertyChangeSupport.firePropertyChange("targetPosition", old, this.targetPosition);

        return targetPosition;
    }

    /**
     *
     * @param pos
     * @return
     */
    @Override
    public boolean checkPosition(int pos) {
        return Math.abs(targetPosition - pos) <= realToScalePos(posError);
    }

    /**
     * Read value of given parameter
     *
     * @param addressName Name of parameter we want to read from
     * @return Value at address given by parameter name
     */
    private int getValue(String addressName) {

        // Get values for this parameter name
        int valLength = addresses.get(addressName).length;
        int addr = addresses.get(addressName).addr;

        // Prepare TxPacket with id and read instruction
        AX12TxPacket send = new AX12TxPacket(this.externalId, AX12Packet.READ_DATA);
        // Define address and length we want to read from
        int[] inst = {addr, valLength};
        // And send it off
        send.setParams(inst);

        GuiLogger.getLogger().log(Level.INFO, "Asking for {0} value(s) at address {1}", new Object[]{valLength, addr});

        // Wait till we received an answer from the servo
        AX12RxPacket answer = conn.sendAndWait(send);

        // If we've received a valid answer, return the content
        if (answer.isValid()) {
            if (SessionManager.getDebugMode()) {
                return 0;
            } else if (valLength == 1) {
                // We've requested one byte, so return it
                return answer.getContent()[0];
            } else if (valLength == 2) {
                // We've requested 2 bytes, so add up high and low byte to get corresponding integer
                return answer.getContent()[0] + ((answer.getContent()[1]) << 8);
            }
        }
        return -1;
    }

    /**
     *
     */
    public void updateValues() {

        // Prepare TxPacket with id and read instruction
        AX12TxPacket send = new AX12TxPacket(this.externalId, AX12Packet.READ_DATA);

        // Read a whole block of info from goal position to present voltage
        int[] inst = {addresses.get("GOAL_POSITION").addr, 17};
        // And send it off
        send.setParams(inst);

        GuiLogger.getLogger().log(Level.INFO, "Asking for updated values from servo {0} on {1}", new Object[]{this.externalId, conn.getPortName()});

        // Wait till we received an answer from the servo
        AX12RxPacket answer = conn.sendAndWait(send);

        // If we've received a valid answer, save the content
        if (answer.isValid() || !SessionManager.getDebugMode()) {

            int val;
            int old;

            // get goal position
            val = answer.getContent()[0] + (answer.getContent()[1] << 8);
            old = goalPosition;
            goalPosition = realToScalePos(val);
            propertyChangeSupport.firePropertyChange("goalPosition", old, goalPosition);

            // get present position
            val = answer.getContent()[6] + (answer.getContent()[7] << 8);
            old = targetPosition;
            targetPosition = realToScalePos(val);
            propertyChangeSupport.firePropertyChange("targetPosition", old, targetPosition);

            // get present load on motors
            old = presentLoad;
            presentLoad = answer.getContent()[10] + (answer.getContent()[11] & 1);
            presentLoad *= -1 + (answer.getContent()[11] & 2) * 2;
            propertyChangeSupport.firePropertyChange("presentLoad", old, presentLoad);

            // Check Battery
            if (answer.getContent()[12] < minVoltage) {
                GuiLogger.getLogger().warning("Voltage of battery is low! Consider recharging soon!");
            }

            if (answer.getContent()[16] == 1) {
                // Set saved load to undefined
                loadConstant = 1024;
            } else if (reactive) {
                // We want to react but first get load that is constant on motor in this position
                if (loadConstant == 1024) {
                    loadConstant = presentLoad;
                    constantCounter = 0;
                } else {
                    int allowed = this.cycleError;
                    // Ok, no we react to loads that might be applied
                    int diff = loadConstant - presentLoad;
                    if (diff > allowed && constantCounter > this.cyclesUntilReact) {
                        if (targetPosition - 2 >= 0) {
                            setPosition(targetPosition - 2, diff / 5);
                        }
                    } else if (diff < -1 * allowed && constantCounter > this.cyclesUntilReact) {
                        if (targetPosition + 2 <= 100) {
                            setPosition(targetPosition + 2, diff / 5);
                        }
                    } else if (diff > -1 * allowed || diff < allowed) {
                        constantCounter++;
                        loadConstant = presentLoad;
                    }
                }
            }
        }
    }

    /**
     *
     * @param target
     * @param speed
     * @return
     */
    @Override
    public boolean setPosition(int target, int speed) {

        return setPosition(target, speed, AX12Packet.WRITE_DATA);
    }

    /**
     *
     * @param target
     * @param speed
     * @param instr
     * @return
     */
    public boolean setPosition(int target, int speed, int instr) {
        int validTarget = checkRange(target, 0, (int)this.posScaleValue);
        // Check for valid range
        if (target != validTarget) {
            GuiLogger.getLogger().log(Level.WARNING, "Target position has to be between 0 and {0}, got {1}", new Object[]{this.posScaleValue, target});
            // Force target to be within range
            target = validTarget;
        }

        // Prepare TxPacket
        AX12TxPacket send = new AX12TxPacket(this.externalId, instr);

        // Calculate real values from scaled ones
        int pos = scaleToRealPos(target);
        int spd = scaleToRealSpeed(speed);

        // Prepare instruction parameters and send packet
        // Have to convert integers to high and low byte since parameters are 2 bytes long
        int[] inst = {0x1E, pos & 0xFF, (pos & 0xFF00) >> 8, spd & 0xFF, (spd & 0xFF00) >> 8};
        send.setParams(inst);

        GuiLogger.getLogger().log(Level.INFO, "Setting {0} to position {1} with speed {2}", new Object[]{this.externalId, pos, spd});

        // Wait for answer that servo accepted new position
        AX12RxPacket answer = conn.sendAndWait(send);

        if (answer.isValid()) {
            return true;
        } // Acceptance only means the servo attempts to move, not that it has finished movement!
        else {
            GuiLogger.getLogger().log(Level.WARNING, "Servo rejected position change!\n* Request: {0}\n* Answer: {1}", new Object[]{send, answer});
            return false;
        }

    }

    @Override
    public void delayPosition(int target, int speed) {
        setPosition(target, speed, AX12Packet.REG_WRITE);
    }

    @Override
    public void execute() {
        conn.broadcastActionCommand();
    }

    @Override
    public void init() {
        // set motor to default position
        setPosition(defaultPos, defaultSpeed);
    }

    @Override
    public boolean isReady() {

        if (getValue("MOVING") == 0) {
            return true;
        } else {
            return false;
        }

    }

    @Override
    public boolean ping() {

        AX12TxPacket send = new AX12TxPacket(this.externalId, AX12TxPacket.PING);
        AX12RxPacket reply = conn.sendAndWait(send);
        if (reply.isValid() || SessionManager.getDebugMode()) {
            return true;
        } else {
            return false;
        }

    }

    private void checkMinMaxValues() {

        if (!SessionManager.getDebugMode()) {
            // We can check the hardware limits set in the servos
            int readMinPos = getValue("CW_ANGLE_LIMIT");
            int readMaxPos = getValue("CCW_ANGLE_LIMIT");

            if (readMinPos > minPos) {
                // The motor doesn't allow for the minimum defined so far!
                GuiLogger.getLogger().log(Level.WARNING, "Requested minimum value of {0} lower than hardware limits ({1}) for servo {2}", new Object[]{minPos, readMinPos, externalId});
                this.minPos = readMinPos;
            }
            if (readMaxPos < maxPos) {
                // The motor doesn't allow for the maximum defined so far!
                GuiLogger.getLogger().log(Level.WARNING, "Requested maximum value of {0} higher than hardware limits ({1}) for servo {2}", new Object[]{maxPos, readMaxPos, externalId});
                this.maxPos = readMaxPos;
            }
            if (defaultPos < 0 || defaultPos > this.posScaleValue) {
                // The motor doesn't allow for this d!
                GuiLogger.getLogger().log(Level.WARNING, "Requested default value of {0} outside allowed interval [0,{1}] for servo {2}", new Object[]{defaultPos, this.posScaleValue, externalId});
                this.defaultPos = (int)(this.posScaleValue / 2);
            }
        }


    }

    @Override
    public boolean isConnected() {
        return conn.isOpen();
    }
}
