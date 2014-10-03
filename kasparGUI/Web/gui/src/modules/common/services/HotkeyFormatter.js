'use strict';

define(function(require) {

        var HotkeyFormatter = function() {
            this.getDisplayFromEvent = function(keyEvent) {
                var code = keyEvent.which || keyEvent.keyCode; // Not-IE || IE
                var modifiers = "";
                if (keyEvent.altKey) {
                    modifiers += "alt+";
                }

                if (keyEvent.ctrlKey) {
                    modifiers += "ctrl+";
                }

                if (keyEvent.shiftKey) {
                    modifiers += "shift+";
                }

                var disp = this.getCharDisplay(code);
                if (disp !== "" || modifiers !== "") {
                    return modifiers + disp;
                } else {
                    return "";
                }
            };

            this.getCharDisplay = function(charCode) {
                // http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
                var char;
                if (charCode == 8)
                    char = "backspace";
                else if (charCode == 9)
                    char = ""; // tab
                else if (charCode == 13)
                    char = "enter";
                else if (charCode == 16)
                    char = ""; // shift
                else if (charCode == 17)
                    char = ""; // ctrl
                else if (charCode == 18)
                    char = ""; // alt
                else if (charCode == 19)
                    char = ""; // pause/break
                else if (charCode == 20)
                    char = ""; // caps
                else if (charCode == 27)
                    char = "escape";
                else if (charCode == 32)
                    char = "space";
                else if (charCode == 33)
                    char = "pageup";
                else if (charCode == 34)
                    char = "pagedown";
                else if (charCode == 35)
                    char = "end";
                else if (charCode == 36)
                    char = "home";
                else if (charCode == 37)
                    char = "left";
                else if (charCode == 38)
                    char = "up";
                else if (charCode == 39)
                    char = "right";
                else if (charCode == 40)
                    char = "down";
                else if (charCode == 45)
                    char = "ins";
                else if (charCode == 46)
                    char = "del";
                else if (charCode == 91)
                    char = ""; // left win
                else if (charCode == 92)
                    char = ""; // right win
                else if (charCode == 93)
                    char = ""; // select
                else if (charCode == 96)
                    char = "0";
                else if (charCode == 97)
                    char = "1";
                else if (charCode == 98)
                    char = "2";
                else if (charCode == 99)
                    char = "3";
                else if (charCode == 100)
                    char = "4";
                else if (charCode == 101)
                    char = "5";
                else if (charCode == 102)
                    char = "6";
                else if (charCode == 103)
                    char = "7";
                else if (charCode == 104)
                    char = "8";
                else if (charCode == 105)
                    char = "9";
                else if (charCode == 106)
                    char = "*";
                else if (charCode == 107)
                    char = "+";
                else if (charCode == 109)
                    char = "-";
                else if (charCode == 110)
                    char = ".";
                else if (charCode == 111)
                    char = "/";
                else if (charCode == 112)
                    char = "F1";
                else if (charCode == 113)
                    char = "F2";
                else if (charCode == 114)
                    char = "F3";
                else if (charCode == 115)
                    char = "F4";
                else if (charCode == 116)
                    char = "F5";
                else if (charCode == 117)
                    char = "F6";
                else if (charCode == 118)
                    char = "F7";
                else if (charCode == 119)
                    char = "F8";
                else if (charCode == 120)
                    char = "F9";
                else if (charCode == 121)
                    char = "F10";
                else if (charCode == 122)
                    char = "F11";
                else if (charCode == 123)
                    char = "F12";
                else if (charCode == 144)
                    char = ""; // num lock
                else if (charCode == 145)
                    char = ""; // scroll lock
                else if (charCode == 186)
                    char = ";";
                else if (charCode == 187)
                    char = "=";
                else if (charCode == 188)
                    char = ",";
                else if (charCode == 189)
                    char = "-";
                else if (charCode == 190)
                    char = ".";
                else if (charCode == 191)
                    char = "/";
                else if (charCode == 192)
                    char = "`";
                else if (charCode == 219)
                    char = "[";
                else if (charCode == 220)
                    char = "\\";
                else if (charCode == 221)
                    char = "]";
                else if (charCode == 222)
                    char = "'";
                else
                    char = String.fromCharCode(charCode);
                return char;
            };
        };

        return HotkeyFormatter;
    });
