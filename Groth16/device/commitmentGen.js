const circomlibjs = require("circomlibjs");
const axios = require("axios");

async function poseidonHash(id) {
  // Build Poseidon instance. This loads constants & performs setup.
  const poseidon = await circomlibjs.buildPoseidonOpt();

  const hashBigInt = poseidon.F.toObject(poseidon([id]));

  return hashBigInt;
}

const replacer = (key, value) => {
  if (typeof value === "bigint") {
    return value.toString(); // Convert BigInt to string
  }
  return value; // Return other values as-is
};

function generateRandomNumberString(length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10); // Append a random digit (0-9)
  }
  return result;
}

async function main() {
  const randID = generateRandomNumberString(5);
  console.log('Generated random ID:', randID);

  const commitment = await poseidonHash(randID);
  console.log('Generated commitment:', commitment.toString());

  // Lưu ID local để sử dụng sau
  const fs = require("fs");
  fs.writeFileSync("ID.json", randID);
  console.log('ID saved locally');

  // Gửi commitment đến laptop server
  try {
    console.log('Sending commitment to laptop server...');
    const response = await axios.post('http://192.168.80.114:3000/commitment', {
      commitment: commitment.toString()
    });
    console.log('Commitment sent successfully:', response.data.message);
  } catch (error) {
    console.error('Error sending to server:', error.message);
    console.log('Make sure laptop server is running and IP is correct');
  }
}

main();
