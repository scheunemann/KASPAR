#!/bin/bash

function usage() {
    echo "Usage: $0 kasparNumber"
    exit 1
}

function checkRoot() {
    if [ "$(whoami)" != "root" ]; then
        echo "Script requires sudo access.  Rerun `sudo ./configure.sh`"
        exit 1
    fi
    return 0
}

function checkInput() {
    local __number=$1
    re='^[0-9]+$'
    while ! [[ $__number =~ $re ]]; do
        read -p "Enter KASAPR Number (1-20): " __number
    done
    echo $__number
    return 0
}

function printHeader() {
    msg=$1
    if [ -z "$2" ]; then
        large=0
    else
        large=$2
    fi
    divider=''
    cols=`tput cols`

    for (( i=1; i<=$cols; i++ )); do
        divider="$divider-"
    done

    echo $divider
    if [ $large -eq 1 ]; then
        echo ""
    fi
    printf "%*s\n" $(((${#msg}+$cols)/2)) "$msg"
    if [ $large -eq 1 ]; then
       echo ""
    fi
    echo $divider

    return 0
}

function setName() {
    printHeader "Setting Hostname"
    echo "Hostname set to: $1"
    hostname $1
    echo $1 > /etc/hostname
    __hostString="127.0.0.1 $1"
    if ! grep -Fxq "$__hostString" /etc/hosts; then
        echo $__hostString >> /etc/hosts
    fi
    return 0
}

function configureWifi() {
    printHeader "Configuring WiFi"
    __ssid=`echo $1 | awk '{print tolower($0)}'`
    echo "Access Point HOST SSID: $__ssid"
    updateWifiSSID $__ssid
    activateService "hostapd"
    activateService "udhcpd"
    return 0
}

function activateService() {
    printf "Set $1 autostart..."
    cmd="update-rc.d $1 enable"
    error=$(($cmd > /dev/null) 2>&1)
    if [ ${#error} -eq 0 ]; then
        printf "done\n"
        return 0
    else
        printf "ERROR!\n"
        printf "   $error\n"
        return 1
    fi
}

function updateWifiSSID() {
    sed -i "s/ssid=.*/ssid=$1/g" /etc/hostapd/hostapd.conf
    return 0
}

function configureWeb() {
    printHeader "Configuring WebServices"
    activateService "kasparweb"
    return 0
}

function configureBluetooth() {
    printHeader "Configuring Bluetooth"
    echo "Installing bluetooth software..."
    apt-get install bluetooth bluez-utils -yqq
    return 0
}

function configureRTC() {
    printHeader "Configuring Real-Time Clock"
    echo "Installing i2c software..."
    apt-get install python-smbus -yqq
    apt-get install i2c-tools -yqq

    echo "Loading RTC module"
    modprobe rtc-ds1307

    echo "Initializing RTC"
    i2cAddr="/sys/class/i2c-adapter/i2c-1/1-0068"
    if ! [ -d $i2cAddr ]; then
        echo "Adding RTC to i2c bus at 0x68"
        if ! echo ds1307 0x68 > /sys/class/i2c-adapter/i2c-1/new_device; then
            echo "Error adding RTC to bus!"
            echo "Try running configureRTC after next reboot"
            return 1
        fi
    fi

    echo "Setting RTC Clock"
    if hwclock -w; then
        hwclock -w

        time=`hwclock -r`
        echo "Current RTC Time: $time"

        time=`date`
        echo "Current System Time: $time"
    else
        echo "ERROR Setting time on RTC!"
        echo "System clock will not be correct"
        echo "Check time and run 'sudo hwclock -w' to set RTC time"
        return 1
    fi

    return 0
}

function configureAudio() {
    printHeader "Configuring audio subsystem"
    echo "Installing audio bindings..."
    apt-get install portaudio19-dev -yqq
    return 0
}

function reboot() {
    printHeader "Press [Enter] to reboot NOW, or CTRL+C to exit"
    read -p
    reboot
    return 0
}

function loadDatabase() {
    printHeader "Loading Data for $1"
    configDir=`echo $1 | awk '{print tolower($0)}'`
    dbFile="../kasparGUI/kaspar.db"
    dbCommand=". ../kasparGUI/Config/dataLoader.py $configDir flush"
    if [ -f $dbFile ]; then
        echo "Skipping installing database, already configured"
        echo "Run '$dbCommand' to rebuild"
    else
        echo "Installing Kaspar DB"
        $dbCommand
    fi
}

checkRoot
number=`checkInput $1`
name=KASPAR3-$number

printHeader "Configuring $name" 1
setName $name
configureWifi $name
configureWeb
#configureBluetooth
#configureRTC
#configureAudio
#loadDatabase $name
#reboot
