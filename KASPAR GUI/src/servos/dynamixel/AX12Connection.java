/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package servos.dynamixel;

import gui.GuiLogger;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import managers.SessionManager;
import servos.SerialConnection;

/**
 *
 * @author Sven
 */
public class AX12Connection implements PropertyChangeListener {

    private static SerialConnection serialConn = null;
    private static AX12Connection connection = null;    // Singleton!
    private static final int timeout = 1000;
    private HashMap<Integer, AX12RxPacket> packetsWaiting;

    public AX12Connection(int port, int portSpeed) {
        serialConn = SerialConnection.getConnection(port, portSpeed);
        serialConn.addPropertyChangeListener("dataAvailable", this);
        packetsWaiting = new HashMap<Integer, AX12RxPacket>();
    }

    public static AX12Connection getConnection(int port, int speed) {        
        if (connection == null) {
            connection = new AX12Connection(
                    port,
                    speed);
        }

        return connection;
    }

    public boolean isOpen() {
        return serialConn.isOpen();
    }

    public synchronized void send(AX12TxPacket packet) {

        GuiLogger.getLogger().log(Level.INFO, "Sending packet: {0}", packet);
        serialConn.write(packet.build());
    }

    public synchronized AX12RxPacket sendAndWait(AX12TxPacket packet) {

        GuiLogger.getLogger().log(Level.CONFIG, "Sending packet and waiting: {0}", packet);

        serialConn.write(packet.build());
        AX12RxPacket ret = new AX12RxPacket();

        int count = 0;

        if (!SessionManager.getDebugMode()) {
            while (!hasPacketWaiting(packet.getId()) && count < 10) {
                try {
                    Thread.sleep(timeout / 10);
                    count++;
                } catch (InterruptedException ex) {
                    GuiLogger.getLogger().log(Level.SEVERE, null, ex);
                }
            }

            if (count == 10) {
                GuiLogger.getLogger().log(Level.WARNING, "Read-Timeout! No answer from AX12 port {0}", serialConn.getPortName());
            } else {
                ret = getAnswer(packet.getId());
                if (ret == null) {
                    ret = new AX12RxPacket();
                }
            }
        } else {
            ret = new AX12RxPacket();
        }

        GuiLogger.getLogger().log(Level.INFO, "Received packet: {0}", ret);

        return ret;

    }

    public synchronized void broadcastActionCommand() {

        AX12TxPacket send = new AX12TxPacket(AX12Packet.BROADCAST_ID, AX12Packet.ACTION);

        int[] inst = {};
        send.setParams(inst);

        GuiLogger.getLogger().log(Level.INFO, "Sending 'moveAll' command!");

        send(send);
    }

    /**
     * Returns a RxPacket for servo with given name if a packet is available in
     * the buffer
     *
     * @param servoID
     * @return Buffered return packet
     */
    public synchronized AX12RxPacket getAnswer(Integer servoID) {

        return packetsWaiting.remove(servoID);
    }

    /**
     * Returns true if there are packets in the buffer
     *
     * @param id Servo name to ask for
     * @return True, if packets are available, false otherwise
     */
    public synchronized boolean hasPacketWaiting(Integer id) {
        return packetsWaiting.containsKey(id);
    }

    private void parseReadBuffer(List<Integer> readBuffer) {

        // Look for packet header
        while (readBuffer.get(0) != 0xFF && readBuffer.get(1) != 0xFF && readBuffer.size() > 5) {
            // Remove bytes that are not header since they are junk
            readBuffer.remove(0);
        }

        // If we are not holding a whole package in the buffer yet, return and wait for more input
        if (readBuffer.size() < 6 || readBuffer.size() < (readBuffer.get(3) + 4)) {
            return;
        }

        // Buffer now starts with a package, so get it
        int[] cut = new int[readBuffer.get(3) + 4];
        for (int i = 0; i < cut.length; i++) {
            cut[i] = readBuffer.remove(0);
        }

        AX12RxPacket p = new AX12RxPacket(cut);

        // And now add it to the packet buffer
        packetsWaiting.put(cut[2], p);
    }

    @Override
    public void propertyChange(PropertyChangeEvent evt) {
        parseReadBuffer(serialConn.getReadBuffer());
    }

    public Object getPortName() {
        return this.serialConn.getPortName();
    }
}
