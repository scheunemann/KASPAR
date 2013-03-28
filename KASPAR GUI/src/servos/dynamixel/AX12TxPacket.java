/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package servos.dynamixel;

/**
 *
 * @author Sven
 */
public class AX12TxPacket extends AX12Packet {

    public AX12TxPacket(int id, int inst) {
        super(id);

        if (inst == PING
                || inst == READ_DATA
                || inst == WRITE_DATA
                || inst == REG_WRITE
                || inst == ACTION
                || inst == RESET
                || inst == SYNC_WRITE) {
            this.inst = inst;
        } else {
            System.err.println("ERROR: Instruction " + inst + " not known!");
        }
    }

    @Override
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
}
