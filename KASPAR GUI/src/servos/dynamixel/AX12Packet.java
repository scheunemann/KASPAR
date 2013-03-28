/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package servos.dynamixel;

import java.util.Vector;

/**
 *
 * @author Sven
 */
public abstract class AX12Packet {

    // Instruction Codes
    public final static int PING = 0x1;
    public final static int READ_DATA = 0x2;
    public final static int WRITE_DATA = 0x3;
    public final static int REG_WRITE = 0x4;
    public final static int ACTION = 0x5;
    public final static int RESET = 0x6;
    public final static int SYNC_WRITE = 0x83;
    public static final int BROADCAST_ID = 0xFE;
    // Other constants
    protected final static int HEADER = 0xFF;
    private static final char HEX_CHARS[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};
    protected int[] content = new int[0];
    protected int id;
    protected int inst;

    public AX12Packet(int id) {

        content = new int[0];

        if (id < 0x100) {
            this.id = id;
        } else {
            System.err.println("ERROR: id greater that 0xFF not allowed!");
        }
    }

    public int getId() {
        return id;
    }

    public int getInst() {
        return inst;
    }

    public boolean isEmpty() {
        return id == 0;
    }

    public int[] getContent() {
        return content;
    }

    protected int getCheckSum() {

        int checksum = id + content.length + 2 + inst;

        for (int b : content) {
            checksum += b;
        }

        checksum = ~checksum;

        return checksum & 0xFF;
    }

    public byte[] build() {

        byte[] packet = new byte[6 + content.length];

        packet[0] = (byte) HEADER;
        packet[1] = (byte) HEADER;
        packet[2] = (byte) id;
        packet[3] = (byte) (content.length + 2);
        packet[4] = (byte) inst;
        packet[packet.length - 1] = (byte) getCheckSum();

        for (int i = 0; i < content.length; i++) {
            packet[5 + i] = (byte) content[i];
        }

        return packet;
    }

    /**
     * Set the parameter part of the package BE CAREFUL: The parameters have to
     * be checked for correct range and 2 byte parameters have to be sent as
     * high- and low byte. The method assumes the parameter list to be correct!
     *
     * @param params Correct parameters for the instruction (usually address +
     * parameter list)
     *
     */
    public void setParams(int[] params) {
        content = params;
    }

    @Override
    public String toString() {

        StringBuilder s = new StringBuilder("AX12Packet [ ");
        byte[] bArr = build();
        for (byte b : bArr) {
            s.append(byteToStringHex(b));
            s.append(" ");
        }
        s.append("]");

        return s.toString();
    }

    private static StringBuffer byteToStringHex(int b) {

        StringBuffer s = new StringBuffer();
        char highNibble = HEX_CHARS[(b & 0xF0) >> 4];
        char lowNibble = HEX_CHARS[b & 0x0F];
        s.append(highNibble);
        s.append(lowNibble);
        return s;
    }
}
