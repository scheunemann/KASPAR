#!/usr/bin/env python
from subprocess import check_output
from collections import namedtuple
import gobject

import sys
import dbus
import dbus.service
import dbus.mainloop.glib

Device = namedtuple('Device', ['addr', 'name'])

def scan():
    output = check_output(["hcitool", "scan"])
    devices = []
    #First line is 'Scanning...' message
    for line in output.splitlines()[1:]:
        parts = line.split()
        if parts:
            devices.append(Device(parts[0], ' '.join(parts[1:])))
    return devices

def getDevice(adapter, bus, device):
    try:
        path = adapter.FindDevice(device.addr)
        device = dbus.Interface(bus.get_object("org.bluez", path), "org.bluez.Device")
        return device
    except dbus.DBusException as e:
        if e._dbus_error_name == 'org.bluez.Error.DoesNotExist':
            return None
        else:
            raise

def deauthorize(device):
    loop = dbus.mainloop.glib.DBusGMainLoop()
    bus = dbus.SystemBus(mainloop=loop)
    manager = dbus.Interface(bus.get_object("org.bluez", "/"), "org.bluez.Manager")
    adapterPath = manager.DefaultAdapter()
    adapter = dbus.Interface(bus.get_object("org.bluez", adapterPath), "org.bluez.Adapter")

    btDev = getDevice(adapter, bus, device)
    if btDev:
        adapter.RemoveDevice(btDev.object_path)

def authorize(device):
    loop = dbus.mainloop.glib.DBusGMainLoop()
    bus = dbus.SystemBus(mainloop=loop)
    manager = dbus.Interface(bus.get_object("org.bluez", "/"), "org.bluez.Manager")
    adapterPath = manager.DefaultAdapter()
    adapter = dbus.Interface(bus.get_object("org.bluez", adapterPath), "org.bluez.Adapter")

    path = "/test/agent"
    btDev = getDevice(adapter, bus, device)
    if btDev:
        btDev.SetProperty("Trusted", dbus.Boolean(1))
        return

    agent = None
    try:
        mainloop = gobject.MainLoop()
        agent = Agent(bus, path, mainloop)
        print "Press '0000' then 'Enter' on the keypad"
        adapter.CreatePairedDevice(device.addr, path, "KeyboardDisplay",
                                        reply_handler=lambda device: mainloop.quit(),
                                        error_handler=lambda error: mainloop.quit())
        mainloop.run()
        btDev = getDevice(adapter, bus, device)
        if btDev:
            print "Success"
            btDev.SetProperty("Trusted", dbus.Boolean(1))
        else:
            print "Error"
    finally:
        if agent:
            agent.remove_from_connection(bus, path)

class Rejected(dbus.DBusException):
        _dbus_error_name = "org.bluez.Error.Rejected"

class Agent(dbus.service.Object):

        @dbus.service.method("org.bluez.Agent", in_signature="", out_signature="")
        def Release(self):
            pass

        @dbus.service.method("org.bluez.Agent", in_signature="os", out_signature="")
        def Authorize(self, device, uuid):
            return

        @dbus.service.method("org.bluez.Agent", in_signature="o", out_signature="s")
        def RequestPinCode(self, device):
            return "0000"

        @dbus.service.method("org.bluez.Agent", in_signature="o", out_signature="u")
        def RequestPasskey(self, device):
            return dbus.UInt32("0000")

        @dbus.service.method("org.bluez.Agent", in_signature="ou", out_signature="")
        def DisplayPasskey(self, device, passkey):
            pass

        @dbus.service.method("org.bluez.Agent", in_signature="ou", out_signature="")
        def RequestConfirmation(self, device, passkey):
            return

        @dbus.service.method("org.bluez.Agent", in_signature="s", out_signature="")
        def ConfirmModeChange(self, mode):
            return

        @dbus.service.method("org.bluez.Agent", in_signature="", out_signature="")
        def Cancel(self):
            pass

if __name__ == '__main__':
    devices = scan()
    authorize(devices[0])

