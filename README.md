Certainly! Here's the markdown representation of the documentation:

markdown

# TwoFactorAuth Smart Contract Documentation

## Overview

The `TwoFactorAuth` smart contract is a Solidity-based implementation that provides two-factor authentication (2FA) functionality. It allows users to register, generate one-time passwords (OTPs), and authenticate using these OTPs. The OTPs are generated based on a user's unique seed and the current time, ensuring that they are valid for a limited period. Interaction with this smart contract is facilitated through an Express.js API. The contract is deployed using the Truffle framework to a local Ganache blockchain.

## Table of Contents

1. [Contract Structure](#contract-structure)
2. [Events](#events)
3. [Structs](#structs)
4. [Mappings](#mappings)
5. [Functions](#functions)
   - [registerUser](#registeruser)
   - [generateOTP](#generateotp)
   - [authenticate](#authenticate)
6. [Deployment](#deployment)
7. [Express.js API Integration](#expressjs-api-integration)
   - [Registering a User](#registering-a-user)
   - [Generating an OTP](#generating-an-otp)
   - [Authenticating with an OTP](#authenticating-with-an-otp)
8. [Usage Example](#usage-example)

## Contract Structure

### SPDX License Identifier

Solidity Version

solidity

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
```

Contract Definition

solidity

```solidity
contract TwoFactorAuth {
// ...
}
```

## Events

`GenerateOTP`

Emitted when an OTP is generated for a user.

```solidity

event GenerateOTP(address publicKey, uint otp);
```

`Authenticated`

Emitted when an authentication attempt is made.

```solidity

event Authenticated(bool isAuthenticated);
```

## Structs

`User`

Defines the properties of a registered user.

```solidity

struct User {
    string username;
    address publicKey;
    string otpSeed;
    uint lastOTPTimestamp;
    uint generatedOTP;
}
```

## Mappings

`users`

Maps an address to a User struct.

```solidity

mapping(address => User) users;
```

`usersAddresses`

Maps a username to an address.

```solidity

mapping(string => address) usersAddresses;
```

## Functions

`registerUser`

Registers a new user with a unique username and OTP seed.

```solidity

function registerUser(string memory _username, string memory _otpSeed) public {
require(usersAddresses[_username] == address(0), "Username already exists");
require(users[msg.sender].publicKey == address(0), "Public key already exists");

    users[msg.sender] = User(_username, msg.sender, _otpSeed, 0, 0);
    usersAddresses[_username] = msg.sender;

}
```

`generateOTP`

Generates a one-time password for the user calling the function.

```solidity

function generateOTP() public returns (uint) {
User storage user = users[msg.sender];
require(user.publicKey != address(0), "User not registered");

    uint timeBasedValue = block.timestamp / 30;
    bytes32 hash = keccak256(abi.encodePacked(user.otpSeed, timeBasedValue));
    uint otp = uint(hash) % 1000000;

    user.lastOTPTimestamp = block.timestamp;
    user.generatedOTP = otp;

    emit GenerateOTP(msg.sender, otp);
    return otp;

}
```

`authenticate`

Authenticates the user by verifying the entered OTP.

```solidity

function authenticate(uint \_otpEntered) public returns (uint8) {
User storage user = users[msg.sender];
require(user.publicKey != address(0), "User not registered");

    uint timeBasedValue = block.timestamp / 30;
    bytes32 hash = keccak256(abi.encodePacked(user.otpSeed, timeBasedValue));
    uint otp = uint(hash) % 1000000;

    if (_otpEntered == otp && _otpEntered == user.generatedOTP && (block.timestamp - user.lastOTPTimestamp) <= 30) {
        user.lastOTPTimestamp = block.timestamp;
        user.generatedOTP = 0;

        emit Authenticated(true);
        return 0;
    }

    emit Authenticated(false);
    return 1;

}
```

## Deployment

Prerequisites

    Node.js
    Truffle
    Ganache

Steps

Install Truffle and Ganache:

```sh

npm install -g truffle
npm install -g ganache-cli
```

Initialize Truffle Project:

```sh

truffle init
```

Create and Compile the Smart Contract:
Place the TwoFactorAuth contract in the contracts directory and compile it:

```sh

truffle compile
```

Deploy the Contract:
Write a migration script in the migrations directory:

```javascript
const TwoFactorAuth = artifacts.require("TwoFactorAuth");

module.exports = function (deployer) {
  deployer.deploy(TwoFactorAuth);
};
```

Deploy to the local Ganache blockchain:

```sh

    truffle migrate
```

## Express.js API Integration

To facilitate interaction with the TwoFactorAuth smart contract, an Express.js API has been set up with the following routes:
Router Setup

Registering a User

    Endpoint: /register
    Method: POST
    Controller: registerController

Registers a new user by calling the registerUser function in the smart contract.

Request Body:

```json
{
  "username": "uniqueUsername",
  "otpSeed": "yourOtpSeed"
}
```

Generating an OTP

    Endpoint: /generate-otp
    Method: GET
    Controller: generateOTPController

Generates an OTP by calling the generateOTP function in the smart contract.

Response:

```sh
$ 0x5C8e0370568bEA98835E33F54C7D50DFE3EE02b3 121321
```

Authenticating with an OTP

    Endpoint: /authenticate
    Method: POST
    Controller: authenticateController

Authenticates the user by calling the authenticate function in the smart contract.

Request Body:

```json
{
  "otp": 123456
}
```

Response:

```json
{
  "authenticated": true
}
```

Usage Example
Registering a User

To register a user, send a POST request to /register with the username and OTP seed.

```sh

curl -X POST http://localhost:3000/api/register -H "Content-Type: application/json" -d '{"username": "uniqueUsername", "otpSeed": "yourOtpSeed"}'
```

Generating an OTP

To generate an OTP, send a GET request to /generate-otp.

```sh

curl -X GET http://localhost:3000/api/generate-otp
```

The response will contain the transaction receipt.
Authenticating with an OTP

To authenticate using an OTP, send a POST request to /authenticate with the OTP.

```sh

curl -X POST http://localhost:3000/authenticate -H "Content-Type: application/json" -d '{"otp": 123456}'
```

The response will indicate whether authentication was successful.
