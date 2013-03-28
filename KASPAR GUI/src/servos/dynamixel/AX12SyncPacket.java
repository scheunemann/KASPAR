/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package servos.dynamixel;

import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import servos.AX12;

/**
 *
 * @author Sven
 */
public class AX12SyncPacket extends AX12TxPacket {

    // Address to write commands to (First byte of block to be written)
    private String address;
    // Length of bytes to be written
    private int commandLength;
    // Holds the commands that have to be packed together
    private HashMap<AX12, int[]> commands;

    /**
     * Initialises one SyncPacket Creates underlying TxPacket and initialises
     * HashMap with correct command length
     *
     * @param address Starting address for command
     * @param length Length of bytes to write per servo
     */
    public AX12SyncPacket(String address, int length) {

        // Initialise TXPacket
        super(AX12Packet.BROADCAST_ID, AX12Packet.SYNC_WRITE);

        this.address = address;         // Same for all commands
        this.commandLength = length;    // All commands have to have same length

        // Initialise HashMap
        commands = new HashMap<AX12, int[]>();

    }

    public void add(AX12 servo, int[] params) {

        if (params.length != commandLength) {
            Logger.getLogger(AX12SyncPacket.class.getName()).log(Level.WARNING, "Command for SyncPacket has wrong length! Is {0}, expected {1}", new Object[]{params.length, commandLength});
        } else {
            commands.put(servo, params);
        }
    }

    /**
     * Convenience method for add(Servo, int[]) to hide parameter recalculation
     * from outside. Takes two 2-byte values and creates parameter value for
     * servo
     *
     * @param servo
     * @param val1 Position
     * @param val2 Speed
     */
    public void add(AX12 servo, int val1, int val2) {

        int[] params = {servo.scaleToRealPos(val1) & 0xFF,
            (servo.scaleToRealPos(val1) & 0xFF00) >> 8,
            servo.scaleToRealSpeed(val2) & 0xFF,
            (servo.scaleToRealSpeed(val2) & 0xFF00) >> 8};
        add(servo, params);
    }

    /**
     * Builds the string that has to be send for this packet according to the
     * protocol and returns it as byte array
     *
     * @return Byte array representing string in correct format
     */
    @Override
    public byte[] build() {

        // First piece content together
        content = new int[2 + commands.size() * (commandLength + 1)];
        // Write SYNC_WRITE header
        content[0] = AX12.getParamAddress(address);    // starting address
        content[1] = commandLength; // length of command per servo (excluding id of servo)
        // And now add all commands
        int i = 2;
        for (AX12 s : commands.keySet()) {
            // First add id of servo
            content[i++] = s.getExternalId();
            // Then attach command sequence
            int[] arr = commands.get(s);
            for (int j = 0; j < commandLength; j++) {
                content[i++] = arr[j];
            }
        }

        return super.build();
    }
}
