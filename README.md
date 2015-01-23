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

Additional information for trouble shooting:
- http://elinux.org/RPi_Bluetooth_keyboard_setup
- https://wiki.debian.org/BluetoothUser
