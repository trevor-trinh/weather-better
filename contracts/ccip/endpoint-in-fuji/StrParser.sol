// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StringParser {
    struct Data {
        bool is_owner;
        uint256 pool_ID;
        string location;
        string day_time;
        uint256 weather;
        address user_address;
        uint256 amount;
        bool bool_bet;
    }

    function parseData(string memory dataString) public pure returns (Data memory) {
        Data memory data;
        
        bytes memory stringBytes = bytes(dataString);
        bytes memory buffer = new bytes(stringBytes.length);

        uint256 k = 0; // buffer index
        uint256 j = 0; // field index
        
        for(uint i = 0; i < stringBytes.length; i++) {
            // Skip the first and last character (parentheses)
            if (i == 0 || stringBytes[i] == '(' || stringBytes[i] == ')') continue;
            
            // If comma or end of string, process buffer
            if (stringBytes[i] == '+' || i == stringBytes.length - 1) {
                if (i == stringBytes.length - 1 && stringBytes[i] != '+') {
                    buffer[k++] = stringBytes[i];
                }

                if (j == 0) data.is_owner = (buffer[0] == '1');
                else if (j == 1) data.pool_ID = toUint(buffer, k);
                else if (j == 2) data.location = string(buffer);
                else if (j == 3) data.day_time = string(buffer);
                else if (j == 4) data.weather = toUint(buffer, k);
                else if (j == 5) data.user_address = toAddress(buffer, k);
                else if (j == 6) data.amount = toUint(buffer, k);
                else if (j == 7) data.bool_bet = (buffer[0] == '1');

                // Reset buffer
                k = 0;
                j++;
            } else {
                buffer[k++] = stringBytes[i];
            }
        }

        return data;
    }

    function toUint(bytes memory b, uint len) private pure returns (uint256) {
        uint256 number;
        for(uint i = 0; i < len; ++i){
            number = number * 10 + (uint8(b[i]) - uint8(0));
        }
        return number;
    }

    function toAddress(bytes memory b, uint len) private pure returns (address) {
        uint160 total;
        for (uint i = 0; i < len; i++) {
            if (uint8(b[i]) >= 48 && uint8(b[i]) <= 57) {
                total = total * 16 + (uint8(b[i]) - 48); // numbers
            } else if (uint8(b[i]) >= 97 && uint8(b[i]) <= 102) {
                total = total * 16 + (uint8(b[i]) - 87); // lowercase a-f
            } else if (uint8(b[i]) >= 65 && uint8(b[i]) <= 70) {
                total = total * 16 + (uint8(b[i]) - 55); // uppercase A-F
            }
        }
        return address(total);
    }
}
