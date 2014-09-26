#!/bin/bash

if [ "$(whoami)" != "root" ]
  then
    echo "Script must be run with sudo"
    exit 1
fi


echo "Configuring WiFi Access Point HOST"
update-rc.d hostapd enable
update-rc.d udhcpd enable

echo ""
echo "Configuring WebUI Service"
update-rc.d kasparweb enable

echo ""
echo "Installing i2c software"
apt-get install python-smbus -yq
apt-get install i2c-tools -yq

echo ""
echo "Don't forget to run confgureRTC after rebooting"
read -p "Press [Enter] to reboot NOW, or CTRL+C to exit"

echo reboot
