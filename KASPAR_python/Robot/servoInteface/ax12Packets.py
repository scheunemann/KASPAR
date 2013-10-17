# import logging
#     
# class AX12Packet(object):
#     """
#     * Structure to hold one servo address and name it
#     """
#     class AX12Address:
#         def __init__(self, name, addr, length):
#             self.name = name
#             self.addr = addr
#             self.length = length
#     
#     # Initialisation block
#     _addresses = {
#         "GOAL_POSITION": AX12Address("GOAL_POSITION", 0x1E, 2),
#         "PRESENT_POSITION": AX12Address("PRESENT_POSITION", 0x24, 2),
#         "PRESENT_POSITION": AX12Address("PRESENT_POSITION", 0x24, 2),
#         "CW_ANGLE_LIMIT": AX12Address("CW_ANGLE_LIMIT", 0x06, 2),
#         "CCW_ANGLE_LIMIT": AX12Address("CCW_ANGLE_LIMIT", 0x08, 2),
#         "MOVING_SPEED": AX12Address("MOVING_SPEED", 0x20, 2),
#         "PRESENT_SPEED": AX12Address("PRESENT_SPEED", 0x26, 2),
#         "TORQUE_LIMIT": AX12Address("TORQUE_LIMIT", 0x22, 2),
#         "PRESENT_LOAD": AX12Address("PRESENT_LOAD", 0x28, 2),
#         "MOVING": AX12Address("MOVING", 0x2E, 1),
#         "TORQUE_ENABLE": AX12Address("TORQUE_ENABLE", 0x18, 1),
#         }
# 
# 
#     # Instruction Codes
#     PING = 0x1;
#     READ_DATA = 0x2;
#     WRITE_DATA = 0x3;
#     REG_WRITE = 0x4;
#     ACTION = 0x5;
#     RESET = 0x6;
#     SYNC_WRITE = 0x83;
#     BROADCAST_ID = 0xFE;
#     # Other constants
#     HEADER = 0xFF;
#     HEX_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
# 
#     def __init__(self, packetId):
#         self._logger = logging.getLogger(__name__)
#         self._content = []
#         self._inst = 0
# 
#         if packetId < 0x100:
#             self._packetId = packetId
#         else:            
#             self._logger.critical("ERROR: id greater that 0xFF not allowed! Got ", id)
#             raise ValueError
# 
#     @property
#     def packetId(self):
#         return self._packetId
#     
#     @property
#     def content(self):
#         return self._content
#     
#     @content.setter
#     def content(self, value):
#         """
#         * Set the parameter part of the package BE CAREFUL: The parameters have to
#         * be checked for correct range and 2 byte parameters have to be sent as
#         * high- and low byte. The method assumes the parameter list to be correct!
#         *
#         * @param params Correct parameters for the instruction (usually address +
#         * parameter list)
#         *
#         """
#         self._content = value
# 
#     @property
#     def inst(self):
#         return self._inst
# 
#     @property
#     def checksum(self):
#         checksum = self._packetId + len(self._content) + 2 + self._inst + sum(self._content)
#         checksum = ~checksum
#         return checksum & 0xFF
# 
#     def build(self):
#         packet = [0] * 6 + len(self._content)
# 
#         packet[0] = AX12Packet.HEADER
#         packet[1] = AX12Packet.HEADER
#         packet[2] = self._packetId
#         packet[3] = len(self._content) + 2
#         packet[4] = self._inst
#         packet[-1] = self.getCheckSum()
# 
#         for i in range(0, len(self._content)):
#             packet[5 + i] = self._content[i]
# 
#         return packet;
# 
#     def __repr__(self):
#         rep = "AX12Packet [ "
#         for b in self.build():
#             rep += "%s " % self.byteToStringHex(b)
# 
#         rep += "]"
#         return rep
# 
#     def byteToStringHex(self, byte):
#         highNibble = AX12Packet.HEX_CHARS[(byte & 0xF0) >> 4]
#         lowNibble = AX12Packet.HEX_CHARS[byte & 0x0F]
#         return "%s%s" % (highNibble, lowNibble)
# 
# class AX12TxPacket(AX12Packet):
# 
#     def __init__(self, packetId, instruction):
#         super(AX12TxPacket, self).__init__(packetId)
# 
#         if (instruction == AX12Packet.PING
#                 or instruction == AX12Packet.READ_DATA
#                 or instruction == AX12Packet.WRITE_DATA
#                 or instruction == AX12Packet.REG_WRITE
#                 or instruction == AX12Packet.ACTION
#                 or instruction == AX12Packet.RESET
#                 or instruction == AX12Packet.SYNC_WRITE):
#             self._inst = instruction
#         else:
#             self._logger.error("ERROR: Instruction %s not known!", instruction)
#             raise ValueError
# 
# class AX12SyncPacket(AX12TxPacket):
#     """
#     * Initialises one SyncPacket Creates underlying TxPacket and initialises
#     * HashMap with correct command length
#     *
#     * @param address Starting address for command
#     * @param length Length of bytes to write per servo
#     """
#     def __init__(self, address, length):
#         # Initialise TXPacket
#         super(AX12SyncPacket, self).__init__(AX12Packet.BROADCAST_ID, AX12Packet.SYNC_WRITE)
#         
#         # Address to write commands to (First byte of block to be written)
#         self._address = address # Same for all commands
#         
#         # Length of bytes to be written
#         self._commandLength = length # All commands have to have same length
# 
#         # Initialise HashMap
#         self._commands = {}
# 
#     def add(self, servo, params):        
#         if len(params) != self._commandLength:
#             self._logger.warning("Command for SyncPacket has wrong length! Is %s, expected %s", len(params), self._commandLength)
#         else:
#             self._commands[servo] = params
# 
#     """
#     * Builds the string that has to be send for this packet according to the
#     * protocol and returns it as byte array
#     *
#     * @return Byte array representing string in correct format
#     """
#     def build(self):
#         # First piece content together
#         self._content = [0] * 2 + len(self._commands) * (self._commandLength + 1)
#         # Write SYNC_WRITE header
#         self._content[0] = AX12Packet._addresses[self._address].addr    # starting address
#         self._content[1] = self._commandLength # length of command per servo (excluding id of servo)
#         
#         # And now add all commands
#         i = 2
#         for s in self._commands.keys():
#             # First add id of servo
#             self._content[i] = s.externalId
#             i += 1
#             # Then attach command sequence
#             arr = self._commands[s]
#             for j in range(0, self._commandLength):
#                 self._content[i] = arr[j]
#                 i+=1
# 
#         return super(AX12SyncPacket, self).build()
