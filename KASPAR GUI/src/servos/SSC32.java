/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package servos;

import gui.GuiLogger;
import java.util.logging.Level;
import managers.SessionManager;

/**
 *
 * @author Sven
 */
public class SSC32 extends Servo {

    private static final int SSC32_MAX_POS = 2500;
    private static final int SSC32_MIN_POS = 500;
    private static final int SSC32_MAX_SPEED = 60;
    private static final int SSC32_MIN_SPEED = 0;
    private static final int RESPONSE_TIME = 10;    // Time we wait after sending a command before checking for response
    private static SerialConnection conn = null;
    private int[] delaySend = null;
    private int posError = 0;

    public SSC32(
            int port,
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
            int positionError) {
        super(
                port,
                portSpeed,
                externalId,
                checkRange(minPos, SSC32_MIN_POS, SSC32_MAX_POS),
                checkRange(maxPos, SSC32_MIN_POS, SSC32_MAX_POS),
                checkRange(defaultPos, SSC32_MIN_POS, SSC32_MAX_POS),
                posScaleValue,
                checkRange(minSpeed, SSC32_MIN_SPEED, SSC32_MAX_SPEED),
                checkRange(maxSpeed, SSC32_MIN_SPEED, SSC32_MAX_SPEED),
                defaultSpeed,
                speedScaleValue);

        this.posError = positionError;

        // Check whether the connection is already open
        if (conn == null) {
            conn = SerialConnection.getConnection(
                    port,
                    portSpeed);
        }
    }

    @Override
    public synchronized int getPosition() {

        int old = this.targetPosition;

        if (!SessionManager.getDebugMode()) {

            String send = "QP " + this.externalId + "\r";
            int p = conn.sendGetInt(send.getBytes());
            this.targetPosition = realToScalePos(p * 10);

        } else {
            this.targetPosition = this.defaultPos;
        }

        return this.targetPosition;
    }

    @Override
    public synchronized boolean setPosition(int target, int speed) {

        int validTarget = checkRange(target, 0, (int)this.posScaleValue);
        if (validTarget != target) {
            GuiLogger.getLogger().log(Level.WARNING, "Target position has to be between 0 and {0}, got {1}", new Object[]{this.posScaleValue, target});
            // Force target to be within range
            target = validTarget;
        }

        // Calculate real values
        int pos = scaleToRealPos(target);
        int spd = scaleToRealSpeed(speed);

        String send = "#" + this.externalId + " P" + pos + " T" + spd + "\r";
        GuiLogger.getLogger().log(Level.CONFIG, "Sending SSC32 String: {0}", send);
        conn.write(send.getBytes());

        return true;
    }

    @Override
    public void delayPosition(int target, int speed) {
        this.delaySend = new int[]{target, speed};
    }
 
    /**
     *
     * @param pos
     * @return
     */
    @Override
    public boolean checkPosition(int pos) {
        return Math.abs(this.targetPosition - pos) <= scaleToRealPos(this.posError);
    }

    @Override
    public void init() {

        // set motor to default position
        setPosition(this.defaultPos, this.defaultSpeed);
    }

    @Override
    public boolean isReady() {

        int i = 0;
        char s;
        while (i < 10) {
            GuiLogger.getLogger().log(Level.INFO, "Trying to ping {0} on {1}", new Object[]{this.externalId, conn.getPortName()});

            if (!SessionManager.getDebugMode()) {
                s = conn.sendGetChar("Q \r".getBytes());
            } else {
                s = '.';
            }

            if (s == '.') {
                return true;
            } else {
                GuiLogger.getLogger().info(
                        "SSC32 reports servo movement still in progress and board not ready");
            }
        }
        return false;
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
            GuiLogger.getLogger().log(Level.CONFIG, "Sending delayed SSC32 String: {0}", delaySend);
            this.setPosition(delaySend[0], delaySend[1]);
            this.delaySend = null;
        }

    }

    @Override
    public boolean isConnected() {
        if (conn == null) {
            init();
        }
        return conn.isOpen();
    }
}
