/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package sensors.fsr;

/**
 *
 * @author William
 */
import gnu.io.CommPortIdentifier;
import gnu.io.SerialPort;
import gnu.io.SerialPortEvent;
import gnu.io.SerialPortEventListener;
import java.awt.event.*;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;
import javax.swing.Timer;


/* 
 * This class allows to comunicate with the Arduino board
 * There must be a rxtxserial.dll file in the directory
 * It was made from a class called SerialTest found on the Arduino Playground
 * http://www.arduino.cc/playground/Interfacing/Java
 */
public class FsrSerialReader implements SerialPortEventListener {

    SerialPort serialPort;
    /*The port we are going to use*/
    private String PORT_NAME = "COM3";
    /**
     * Buffered input stream from the port
     */
    private InputStream input;
    /**
     * The output stream to the port
     */
    private OutputStream output;
    /**
     * Milliseconds to block while waiting for port open
     */
    private static final int TIME_OUT = 2000;
    /**
     * Default bits per second for COM port.
     */
    //It works fine at 9600, let's try to do it faster., ten reads per second
    //Keeps working fine at 19200, 25 reads per second
    //It does not work at 28800, don't know why
    private static final int DATA_RATE = 19200;
    /**
     * We store the FSR data here
     */
    private int datasensor[] = new int[32];
    /**
     * We store the byte sent by the Arduino board here
     */
    private int dataint[] = new int[64];
    /**
     * Used to count the times we read the 64 bytes
     */
    private int counter = 0;
    /**
     * Used to count the bytes we read
     */
    private int counter2 = 0;
    //Now the variables used to filter the signal
    private int offset[] = new int[32];
    private double postScaler[] = new double[32];
    private int dataStore[][] = new int[10][32];
    int k = 0;
    Timer timerTune;

    public void initialize() {
        CommPortIdentifier portId = null;
        Enumeration portEnum = CommPortIdentifier.getPortIdentifiers(); //We get all the ports

        // iterate through, looking for the port
        while (portEnum.hasMoreElements()) {
            CommPortIdentifier currPortId = (CommPortIdentifier) portEnum.nextElement();
            if (currPortId.getName().equals(PORT_NAME)) {
                portId = currPortId;
                break;
            }
        }

        if (portId == null) {
            System.out.println("Could not find COM port.");
            return;
        }

        try {
            // open serial port, and use class name for the appName.
            serialPort = (SerialPort) portId.open(this.getClass().getName(),
                    TIME_OUT);

            // set port parameters
            serialPort.setSerialPortParams(DATA_RATE,
                    SerialPort.DATABITS_8,
                    SerialPort.STOPBITS_1,
                    SerialPort.PARITY_NONE);

            // open the streams
            input = serialPort.getInputStream();
            output = serialPort.getOutputStream();

            // add event listeners
            serialPort.addEventListener(this);
            serialPort.notifyOnDataAvailable(true);
        } catch (Exception e) {
            System.err.println(e.toString());
        }
        resetFilter();  //Write the default values on the filter
    }

    /**
     * This should be called when you stop using the port. This will prevent
     * port locking on platforms like Linux.
     */
    public synchronized void close() {
        if (serialPort != null) {
            serialPort.removeEventListener();
            serialPort.close();
        }
    }

    /**
     * Handle an event on the serial port. Read the data and print it.
     */
    @Override
    public synchronized void serialEvent(SerialPortEvent oEvent) {
        if (oEvent.getEventType() == SerialPortEvent.DATA_AVAILABLE) {
            try {

                //This is the way of reading bytes
                //I use char becouse it's unsigned
                int firstread = (char) input.read();
                if (firstread == 0xAB) {   //Read the byte and check if it is the start byte
                    for (int i = 0; i < 64; i++) {
                        dataint[i] = (char) input.read();
                        counter2++;
                    }
                    counter++;

                }
                for (int i = 0; i < 32; i++) {
                    datasensor[i] = 1023 - dataint[2 * i] * 256 - dataint[2 * i + 1];
                }

            } catch (Exception e) {
                System.err.println(e.toString());
            }
        }
        // Ignore all the other eventTypes, but you should consider the other ones.
    }

    public int getFsrRawValue(int j) {
        return datasensor[j];
    }

    public int getCounterValue() {
        return counter;
    }

    public int getCounter2Value() {
        return counter2;
    }

    public void resetCounterValue() {
        counter = 0;
    }

    public void resetCounter2Value() {
        counter2 = 0;
    }

    public void setPortName(String name) {
        PORT_NAME = name;
    }

    public Enumeration getPortAvailable() {
        try {
            Enumeration portEnum = CommPortIdentifier.getPortIdentifiers();
            return portEnum;
        } catch (java.lang.UnsatisfiedLinkError e) {
            return null;
        }
    }

    //Below the functions used to filter the signal
    /*Calculate the postScaler providing the offset*/
    private void calculatePostScaler() {
        for (int i = 0; i < 32; i++) {
            postScaler[i] = 1023 / (1023 - offset[i]);
        }
    }

    /*Sets the offset, doesn't allow 1023*/
    private void SetOffset(int value, int i) {
        if (value == 1023) {
            value = 1022;
        }    //To avoid division by 0
        offset[i] = value;
    }
    /*calculate the offset once we have the data on the data*/

    private void calculateOffset() {
        for (int j = 0; j < 10; j++) {
            if (j == 0) {
                for (int i = 0; i < 32; i++) {
                    SetOffset(dataStore[j][i], i);
                }
            } else {
                for (int i = 0; i < 32; i++) {
                    if (offset[i] > dataStore[j][i]) {
                        SetOffset(dataStore[j][i], i);
                    }
                }
            }
        }
    }

    /*Measure the offset and sets the values of the filter*/
    public void autoTune() {
        int delay2 = 50; //milliseconds
        //Define the task to repeat    
        ActionListener taskPerformer2 = new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent evt) {
                if (k < 10) {
                    System.arraycopy(datasensor, 0, dataStore[k], 0, 32);
                    k++;    //For 10 times we store the data of the sensor
                } else {
                    k = 0;    //restart the counter
                    calculateOffset();
                    calculatePostScaler();
                    timerTune.stop();   //stop the timer
                }
            }
        };

        timerTune = new Timer(delay2, taskPerformer2);
        timerTune.start();  //starts the timer
    }

    /*Gets the filter value*/
    public int getFsrFilterValue(int i) {
        int filterValue = (int) postScaler[i] * (datasensor[i] - offset[i]);
        if (filterValue < 0) {
            filterValue = 0;
        }
        if (filterValue > 1023) {
            filterValue = 1023;
        }
        return filterValue;
    }

    /*reset the filter values*/
    public void resetFilter() {
        for (int i = 0; i < 32; i++) {
            offset[i] = 0;
            postScaler[i] = 1;
        }
    }
}
