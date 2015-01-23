# KASPAR

## Controlling

Switch on KASPAR and connect via a web browser to

- http://192.168.3.1/ or
- http://192.168.3.1/teacher.html.

...

## Setup
packages: python, libpython-dev, pyaudio 2.8 (from: http://people.csail.mit.edu/hubert/pyaudio/)

 git robotcontrol
 `sudo pip install .`
git KASPAR
 `sudo pip install .`


## Bluetooth Keypad

To pair with a specific keypad, start pairing mode of the keypad (button on the back of the keypad) and run a helper script with `sudo ./home/pi/git/KASPAR/Tools/bluetooth.py` and follow the instructions.

#### Trouble Shooting
Check `less /proc/bus/input/devices` whether a dongle called "Bluetooth Keypad" is connected and whether `udevadm info --attribute-walk --name /dev/input/eventX` information matches the udev rule in `/etc/udev/rules.d/98-....`

Additional information for trouble shooting:
- http://elinux.org/RPi_Bluetooth_keyboard_setup
- https://wiki.debian.org/BluetoothUser
