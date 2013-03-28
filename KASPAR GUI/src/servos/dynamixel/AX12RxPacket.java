/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package servos.dynamixel;

import java.util.Arrays;

/**
 *
 * @author Sven
 */
public class AX12RxPacket extends AX12Packet {

    private String error;

    /**
     * Creates a new return packet and parses data Method assumes that header
     * data has already been checked and therefore: 1. data starts with 2 header
     * bytes 2. id is an existing id 3. data has correct length (data[3] + 4)
     *
     * @param data Data of complete packet
     */
    public AX12RxPacket(int[] data) {
        super(data[2]);
        error = "";
        int startIndex = 0;

        // ID
        this.id = data[2];

        // Copy content
        content = Arrays.copyOfRange(data, 5, data.length - 1);

        // Instruction/Error byte
        inst = data[4];
        error = getAX12ErrorMessage(inst);

        // Checksum
        int checksum = data[data.length - 1];
        if (checksum != getCheckSum()) {
            error = "Wrong checksum";
        }

    }

    public AX12RxPacket() {
        super(0);
        error = "Empty packet";
    }

    private static String getAX12ErrorMessage(int error) {

        switch (error) {
            case 0:
                return "Ok!";
            case 1:
                return "Input Voltage Error!";
            case 2:
                return "Angle Limit Error!";
            case 4:
                return "Overheating Error!";
            case 8:
                return "Range Error!";
            case 16:
                return "Checksum Error!";
            case 32:
                return "Overload Error!";
            case 64:
                return "Instruction Error!";
            default:
                return "Unknown Error!";
        }
    }

    @Override
    public String toString() {

        String s = super.toString();
        if (error.equals("")) {
            s += " Ok!";
        } else {
            s += " " + error;
        }
        return s;
    }

    public boolean isValid() {
        return id > 0 && inst == 0;
    }

    @Override
    public int[] getContent() {
        return content.clone();
    }
}
