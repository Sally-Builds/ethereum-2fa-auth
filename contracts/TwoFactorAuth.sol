// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TwoFactorAuth {
    event GenerateOTP(address publicKey, uint otp);
    event Authenticated(bool isAuthenticated);
    struct User {
        string username;
        address publicKey;
        string otpSeed;
        uint lastOTPTimestamp;
        uint generatedOTP;
    }

    mapping(address => User) users;
    mapping(string => address) usersAddresses;

    function registerUser(string memory _username, string memory _otpSeed) public {
        require(usersAddresses[_username] == address(0), "Username already exists");
        require(users[msg.sender].publicKey == address(0), "Public key already exists");

        users[msg.sender] = User(_username, msg.sender, _otpSeed, 0, 0);
        usersAddresses[_username] = msg.sender;
    }

    function generateOTP() public returns (uint) {
    User storage user = users[msg.sender];
    require(user.publicKey != address(0), "User not registered");

    uint timeBasedValue = block.timestamp / 30;
    bytes32 hash = keccak256(abi.encodePacked(user.otpSeed, timeBasedValue));
    uint otp = uint(hash) % 1000000;

    user.lastOTPTimestamp = block.timestamp;  // Use exact timestamp
    user.generatedOTP = otp;  // Store generated OTP to prevent reuse

    emit GenerateOTP(msg.sender, otp);
    return otp;
}

function authenticate(uint _otpEntered) public returns (uint8) {
    User storage user = users[msg.sender];
    require(user.publicKey != address(0), "User not registered");

    uint timeBasedValue = block.timestamp / 30;
    bytes32 hash = keccak256(abi.encodePacked(user.otpSeed, timeBasedValue));
    uint otp = uint(hash) % 1000000;

    if (_otpEntered == otp && _otpEntered == user.generatedOTP && (block.timestamp - user.lastOTPTimestamp) <= 30) {
        user.lastOTPTimestamp = block.timestamp;  // Update last authentication time
        user.generatedOTP = 0;  // Invalidate the OTP after use
        
        emit Authenticated(true);
        return 0;
    }

    emit Authenticated(false);
    return 1;
}


}
