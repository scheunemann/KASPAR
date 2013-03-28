/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package servos;

import java.util.logging.Level;
import gui.GuiLogger;

/**
 *
 * @author Sven
 */
public class MiniSSC extends Servo {

    private static final int MAX_POS = 254;
    private static final int MIN_POS = 0;
    private static SerialConnection conn;
    private static int[] delaySend = null;

    public MiniSSC(
            int port,
            int portSpeed,
            int externalId,
            int minPos,
            int maxPos,
            int defaultPos,
            double posScaleValue) {
        super(
                port,
                portSpeed,
                externalId,
                checkRange(minPos, MIN_POS, MAX_POS),
                checkRange(maxPos, MIN_POS, MAX_POS),
                defaultPos,
                posScaleValue,
                0,
                0,
                0,
                0);

        // Check whether the connection is already open
        if (conn == null) {
            conn = SerialConnection.getConnection(
                    port,
                    portSpeed);
        }
    }

    /**
     * Returns current position of servo
     *
     * @return
     */
    @Override
    public synchronized int getPosition() {
        // We can't get feedback from SSC32-V2 controller so just return current position
        return targetPosition;
    }

    /**
     * Sets the position of a servo. Since SSC32-V2 does not support speed, it
     * is ignored
     *
     * @param target
     * @param speed
     * @return true on successful sending of command (does not mean the position
     * was reached!)
     */
    @Override
    public synchronized boolean setPosition(int target, int speed) {

        int validTarget = checkRange(target, 0, (int)this.posScaleValue);
        if (target != validTarget) {
            GuiLogger.getLogger().log(Level.WARNING, "Target position has to be between 0 and {0}, got {1}", new Object[]{this.posScaleValue, target});
            // Force target to be within range
            target = validTarget;
        }

        this.targetPosition = target;
        // Calculate real values
        int pos = scaleToRealPos(target);

        byte[] send = {(byte) 0xFF, (byte) this.externalId, (byte) pos};
        conn.write(send);

        return true;
    }
    
    @Override
    public void delayPosition(int target, int speed) {
        delaySend = new int[] {target, speed};
    }

    /**
     * Checks the position of the servo No feedback from SSC32-V2 controller, so
     * return true
     *
     * @param pos
     * @return
     */
    @Override
    public boolean checkPosition(int pos) {
        return true;
    }

    @Override
    public void init() {

        // set motor to default position
        setPosition(this.defaultPos, 0);
    }

    @Override
    public boolean isReady() {

        init();
        return true;
    }

    @Override
    public boolean ping() {
        // SSC32 servos don't have ping command, so ask for ready
        return isReady();
    }

    @Override
    public void execute() {

        // Send previously saved commands
        if (delaySend != null) {
            setPosition(delaySend[0], delaySend[1]);
            delaySend = null;
        }

    }

    @Override
    public boolean isConnected() {
        if (conn == null) {
            return false;
        } else {
            return conn.isOpen();
        }
    }
}
