// const {ethers} = require("ethers");
// const base32 = require("base32.js");

// // Define the Base32 string key
// const base32Key = "JBSWY3DPEHPK3PXPADFSDF";

// // Decode the Base32 string to bytes
// const decoder = new base32.Decoder();
// const keyBytes = decoder.write(base32Key).finalize();

// // console.log(ethers.utils.hexZeroPad(ethers.utils.hexlify(keyBytes), 32))

// console.log(keyBytes)

// // Ensure the key is 32 bytes long (if shorter, pad it with zeros)
// let keyBytes32 = ethers.getBytes(ethers.zeroPadValue(ethers.hexlify(keyBytes), 32));

// console.log(keyBytes32)

const base32 = require("base32.js");

// Define the Base32 string key
const base32Key = "JBSWY3DPEHPK3PXPADFSDF";

// Decode the Base32 string to bytes
const decoder = new base32.Decoder();
const keyBytes = decoder.write(base32Key).finalize();

// Ensure the key is 32 bytes long (if shorter, pad it with zeros)
const keyBytes32 = new Uint8Array(32);
keyBytes32.set(keyBytes);

// Convert to hex string
const keyHex = "0x" + Array.from(keyBytes32).map(b => b.toString(16).padStart(2, '0')).join('');

console.log("Hex key:", keyHex);

