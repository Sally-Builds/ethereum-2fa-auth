const fs = require("fs/promises");
const path = require("path");
const { Web3 } = require("web3");

const web3 = new Web3("http://localhost:7545");

const getContract = async () => {
  const contract_url = path.resolve(
    __dirname,
    "../build/contracts/TwoFactorAuth.json"
  );
  const data = JSON.parse(await fs.readFile(contract_url, "utf-8"));

  return new web3.eth.Contract(data.abi, data["networks"]["5777"]["address"]);
};

async function generateOTP() {
  const contract = await getContract();
  //   const otp = await contract.methods
  //     .generateOTP()
  //     .send({ from: "0x5C8e0370568bEA98835E33F54C7D50DFE3EE02b3" });
  //   console.log("Generated OTP:", otp);

  try {
    const tx = await contract.methods.generateOTP().send({
      from: "0x5C8e0370568bEA98835E33F54C7D50DFE3EE02b3",
    });
    const otp = tx.transactionHash; // Get transaction hash for reference

    // Wait for transaction confirmation (optional)
    const receipt = await web3.eth.getTransactionReceipt(otp);
    if (receipt.status) {
      console.log("Generated OTP:", receipt); // Access OTP from event log
    } else {
      console.error("Transaction failed:", receipt);
    }
  } catch (error) {
    console.error("Error generating OTP:", error);
  }
}

generateOTP().then();
