#!/bin/bash

function usage() {
    echo "Usage: $0 kasparNumber"
    exit 1
}

function checkRoot() {
    if [ "$(whoami)" != "root" ]; then
        echo "Script must be run with sudo"
        exit 1
    fi
    return 0
}

function checkInput() {
    local __number=''
    re='^[0-9]+$'
    if [[ $1 =~ $re ]]; then
        __number=$1
    fi
    if [ -z "$__number" ]; then
        read -p "Enter KASAPR Number (1-20): " __number
    fi
    echo $__number
    return 0
}

function printHeader() {
    echo "-------------------------"
    echo "  Configuring $1"
    echo "-------------------------"
    return 0
}

function setName() {
    echo ""
    echo "Setting hostname to: $1"
    hostname $1
    echo $1 > /etc/hostname
    __hostString="127.0.0.1 $1"
    if ! grep -Fxq "$__hostString" /etc/hosts; then
        echo $__hostString >> /etc/hosts
    fi
    return 0
}

function configureWifi() {
    __ssid=`echo $1 | awk '{print tolower($0)}'`
    echo ""
    echo "Configuring WiFi Access Point HOST SSID: $__ssid"
    updateWifiSSID $__ssid
    update-rc.d hostapd enable
    update-rc.d udhcpd enable
    return 0
}

function updateWifiSSID() {
    sed -i "s/ssid=.*/ssid=$1/g" /etc/hostapd/hostapd.conf
    return 0
}

function configureWeb() {
    echo ""
    echo "Configuring WebUI Service"
    update-rc.d kasparweb enable
    return 0
}

function configureBluetooth() {
    echo ""
    echo "Installing bluetooth software"
    apt-get install bluetooth bluez-utils -yq
    return 0
}

function configureRTC() {
    echo ""
    echo "Installing i2c software"
    apt-get install python-smbus -yq
    apt-get install i2c-tools -yq
    return 0
}

function configureAudio() {
    echo ""
    echo "Installing audio bindings"
    apt-get install portaudio19-dev -yq
    return 0
}

function reboot() {
    echo ""
    echo "Don't forget to run confgureRTC after rebooting"
    read -p "Press [Enter] to reboot NOW, or CTRL+C to exit"
    reboot
    return 0
}

checkRoot
number=`checkInput $1`
name=KASPAR3-$number

printHeader $name
setName $name
configureWifi $name
configureWeb
configureBluetooth
configureRTC
configureAudio
reboot
