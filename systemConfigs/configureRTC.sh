#!/bin/bash

if [ "$(whoami)" != "root" ]
  then
    echo "Script must be run with sudo"
    exit 1
fi


echo "Loading rtc module"
modprobe rtc-ds1307

echo "Initializing RTC"
echo ds1307 0x68 > /sys/class/i2c-adapter/i2c-1/new_device

echo "Setting RTC Clock"
hwclock -w

echo "Current RTC Time:"
hwclock -r

