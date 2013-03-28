/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package servos;

import gnu.io.CommPort;
import gnu.io.CommPortIdentifier;
import gnu.io.NoSuchPortException;
import gnu.io.PortInUseException;
import gnu.io.SerialPort;
import gnu.io.SerialPortEvent;
import gnu.io.SerialPortEventListener;
import gnu.io.UnsupportedCommOperationException;
import gui.GuiLogger;
import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.TooManyListenersException;
import java.util.logging.Level;
import managers.SessionManager;

/**
 *
 * @author Sven
 */
public class SerialConnection implements SerialPortEventListener {

    private PropertyChangeSupport propertyChangeSupport = new PropertyChangeSupport(this);
    // Hashmap to hold all currently open serial connections
    private static HashMap<String, SerialConnection> openConnections;
    // Name of port for this connection
    private String portName;
    // Speed for this port
    private int portSpeed;
    // Read buffer
    private ArrayList<Integer> readBuffer;
    // Serial port handle
    private SerialPort serialPort;
    // In- and output streams for connection
    private InputStream serialIn;
    private OutputStream serialOut;

    /**
     * Constructor for serial connection
     *
     * @param portName Name of port to open
     * @param portSpeed Speed of connection in Baud
     */
    @SuppressWarnings("UseOfObsoleteCollectionType")
    private SerialConnection(String portName, int portSpeed) {

        // Set parameters and initialise read buffer
        this.portName = portName;
        this.portSpeed = portSpeed;
        readBuffer = new ArrayList<Integer>();

        if (!SessionManager.getDebugMode()) {
            connect();
        } else {
            GuiLogger.getLogger().log(Level.SEVERE, "Simulating serial connection on {0} with speed {1}", new Object[]{portName, portSpeed});
        }
    }

    /**
     * Returns a serial connection handle for the desired port and speed
     *
     * @param portName
     * @param portSpeed
     * @return An open serial connection or 'null' if there already is an open
     * connection on that port with different speed
     */
    public static SerialConnection getConnection(int port, int portSpeed) {
        String portName = "COM" + port;

        // Check if we already have initialised the hashMap
        if (openConnections == null) {
            openConnections = new HashMap<String, SerialConnection>();
        }

        // Now check whether we already have a connection on that port
        if (!openConnections.containsKey(portName)) {
            // Create new connection
            SerialConnection newConn = new SerialConnection(portName, portSpeed);
            // add it to the open connections
            openConnections.put(portName, newConn);
            // and return it
            return newConn;

        } else {
            // There is already an open connection on that port, so check if the speed matches
            if (openConnections.get(portName).portSpeed == portSpeed) {
                // Speed matches, so return handle to this connection
                return openConnections.get(portName);

            } else {
                // The speed doesn't match, so throw error and return 'null'
                GuiLogger.getLogger().log(Level.SEVERE, "Serial Connection on {0} already open with different baud rate!", portName);
                return null;
            }
        }

    }

    /**
     * @return the portName
     */
    public String getPortName() {
        return portName;
    }

    /**
     * @return true if serial connection is open, false otherwise
     */
    public boolean isOpen() {
        if (!SessionManager.getDebugMode()) {
            return serialPort != null;
        } else {
            return true;
        }
    }

    private void connect() {

        GuiLogger.getLogger().log(Level.INFO, "Trying to open {0} with speed {1}", new Object[]{getPortName(), portSpeed});
        try {
            CommPortIdentifier portIdentifier = CommPortIdentifier.getPortIdentifier(getPortName());
            if (portIdentifier.isCurrentlyOwned()) {
                GuiLogger.getLogger().log(Level.SEVERE, "Port {0} is currently in use", getPortName());
                GuiLogger.getLogger().log(Level.INFO, "Current owner of {0}: {1}", new Object[]{getPortName(), portIdentifier.getCurrentOwner()});
            } else {
                // Open Port
                CommPort commPort = portIdentifier.open("KasparApp", 2000);
                if (commPort instanceof SerialPort) {
                    // Convert to a real serial port
                    serialPort = (SerialPort) commPort;
                    // Set com-port parameters
                    serialPort.setSerialPortParams(portSpeed, SerialPort.DATABITS_8, SerialPort.STOPBITS_1, SerialPort.PARITY_NONE);
                    serialIn = serialPort.getInputStream();
                    serialOut = serialPort.getOutputStream();

                    // See if we can get an event listener there
                    try {
                        serialPort.addEventListener(this);
                    } catch (TooManyListenersException e) {
                    }

                    // activate the DATA_AVAILABLE notifier
                    serialPort.notifyOnDataAvailable(true);

                    GuiLogger.getLogger().log(Level.INFO, "Port open on {0}!", getPortName());
                } else {
                    GuiLogger.getLogger().log(Level.SEVERE, "Error: {0} not a serial port", getPortName());
                }
            }
        } catch (IOException ex) {
            GuiLogger.getLogger().log(Level.SEVERE, "Can't open serial port!");
            GuiLogger.getLogger().log(Level.CONFIG, null, ex);
        } catch (UnsupportedCommOperationException ex) {
            GuiLogger.getLogger().log(Level.SEVERE, "Can't open serial port!");
            GuiLogger.getLogger().log(Level.CONFIG, null, ex);
        } catch (PortInUseException ex) {
            GuiLogger.getLogger().log(Level.SEVERE, "The device {0} is in use! Try unplugging Kaspar''s USB connector and plug it in again", getPortName());
            GuiLogger.getLogger().log(Level.CONFIG, null, ex);
        } catch (NoSuchPortException ex) {
            GuiLogger.getLogger().log(Level.SEVERE, "Can''t find a device connected to {0}! Is Kaspar connected and switched on?", getPortName());
            GuiLogger.getLogger().log(Level.CONFIG, null, ex);
        }
    }

    public List<Integer> getReadBuffer() {
        return Collections.synchronizedList(readBuffer);
    }

    public String readLine() {
        // buffer to store response
        int size = 64;
        byte[] buffer = new byte[size];

        try {
            int c;
            int rsize = 0;

            do {
                c = serialIn.read();
                if (c == -1) {
                    break;
                }
                buffer[rsize] = (byte) c;
                rsize += 1;
            } while (rsize < (size - 1) && c != 13);

            if (rsize == 0) {
                System.err.println("no reply ");
                return null;
            }

            return new String(buffer, 0, rsize);

        } catch (IOException ioe) {

            GuiLogger.getLogger().log(Level.INFO, "Error reading reply from {0}", getPortName());
            GuiLogger.getLogger().log(Level.CONFIG, null, ioe);
        }
        return null;
    }

    public int sendGetInt(byte[] send) {


        // send over the serial link
        try {
            serialOut.write(send);
        } catch (IOException ioe) {

            GuiLogger.getLogger().log(Level.CONFIG, "Error sending string {0} on {1}", new Object[]{send, getPortName()});
            GuiLogger.getLogger().log(Level.CONFIG, null, ioe);
        }

        try {
            int c = serialIn.read();
            GuiLogger.getLogger().log(Level.CONFIG, "Read: {0}", c);
            return c;

        } catch (IOException ioe) {
            GuiLogger.getLogger().log(Level.INFO, "Error reading reply from {0}", getPortName());
            GuiLogger.getLogger().log(Level.CONFIG, null, ioe);
        }
        return 0;
    }

    public char sendGetChar(byte[] send) {

        // send over the serial link
        try {
            serialOut.write(send);
        } catch (IOException ioe) {
            GuiLogger.getLogger().log(Level.INFO, "Error sending string {0}", send);
            GuiLogger.getLogger().log(Level.CONFIG, null, ioe);
        }

        try {
            char c = (char) serialIn.read();
            GuiLogger.getLogger().log(Level.CONFIG, "Read: {0}", c);
            return c;

        } catch (IOException ioe) {
            GuiLogger.getLogger().log(Level.INFO, "Error reading reply from {0}", getPortName());
            GuiLogger.getLogger().log(Level.CONFIG, null, ioe);
        }
        return 0;
    }

    /**
     *
     * @param send
     */
    public void write(byte[] send) {

        if (!SessionManager.getDebugMode()) {
            // send over the serial link
            try {
                GuiLogger.getLogger().log(Level.CONFIG, "Sending {0} on {1}", new Object[]{byteArrToString(send), getPortName()});
                serialOut.write(send);
            } catch (IOException ioe) {
                GuiLogger.getLogger().log(Level.INFO, "Error sending string {0} on {1}", new Object[]{byteArrToString(send), getPortName()});
                GuiLogger.getLogger().log(Level.CONFIG, null, ioe);
            }
        }

    }

    private String byteArrToString(byte[] arr) {

        StringBuilder str = new StringBuilder("[ ");
        for (byte b : arr) {
            str.append((b & 0xF + ((b & 0xF0) >> 4) * 16)).append(" ");
        }
        return str.append(" ]").toString();
    }

    @Override
    public void serialEvent(SerialPortEvent event) {

        switch (event.getEventType()) {
            case SerialPortEvent.BI:
            case SerialPortEvent.OE:
            case SerialPortEvent.FE:
            case SerialPortEvent.PE:
            case SerialPortEvent.CD:
            case SerialPortEvent.CTS:
            case SerialPortEvent.DSR:
            case SerialPortEvent.RI:
            case SerialPortEvent.OUTPUT_BUFFER_EMPTY:
                break;
            case SerialPortEvent.DATA_AVAILABLE:
                // we get here if data has been received
                byte[] buffer = new byte[255];
                int numBytes;
                try {
                    // read data
                    while (serialIn.available() > 0) {
                        numBytes = serialIn.read(buffer);
                        // transfer it into global readBuffer and convert values from byte to int
                        // Byte is signed in Java and data arriving is unsigned, therefore
                        // Integer has to be used to store correct numbers
                        for (int i = 0; i < numBytes; i++) {
                            readBuffer.add(buffer[i] & 0xF + ((buffer[i] & 0xF0) >> 4) * 16);
                        }
                    }
                } catch (IOException e) {
                }

                propertyChangeSupport.firePropertyChange("dataAvailable", false, true);
                GuiLogger.getLogger().log(Level.CONFIG, "Read from serial port {0}: {1}", new Object[]{getPortName(), readBuffer});
                break;
        }
    }

    /**
     * Close connection and free port
     */
    public void close() {

        try {
            serialIn.close();
            serialOut.close();
            serialPort.close();
            openConnections.remove(this.getPortName());
        } catch (IOException ex) {
            GuiLogger.getLogger().log(Level.SEVERE, "Was not able to close serial connection on port " + getPortName(), ex);
        }

    }

    public void addPropertyChangeListener(String propertyName, PropertyChangeListener listener) {
        propertyChangeSupport.addPropertyChangeListener(propertyName, listener);
    }

    public void addPropertyChangeListener(PropertyChangeListener listener) {
        propertyChangeSupport.addPropertyChangeListener(listener);
    }

    public void removePropertyChangeListener(java.beans.PropertyChangeListener listener) {
        propertyChangeSupport.removePropertyChangeListener(listener);
    }

    public void removePropertyChangeListener(String propertyName, PropertyChangeListener listener) {
        propertyChangeSupport.removePropertyChangeListener(propertyName, listener);
    }
}
