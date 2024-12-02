# Project: Function Frontend

This project is an assessment in the Metacrafters Avalanche Course - ETH + AVAX PROOF: Intermediate EVM Course `Module: Smart Contract Management - ETH + AVAX`

The Solidity smart contract is an `Ethereum Badminton Racket Store` that is integrated with a frontend built using `React` and `ethers.js`.

## Getting Started

### Requirements
*  [Metamask Wallet](https://metamask.io/download/)
*  [Node.js](https://nodejs.org/en/download/prebuilt-installer/current)

### Setup
1. Clone repository in your local environment.
2. Inside the project directory, open a terminal:
   * install dependencies
      ```bash
        npm install
       ```
    * start hardhat node
       ```bash
        npx hardhat node
        ```
    * compile and deploy the smart contract using hardhat
       ```bash
          npx hardhat run --network localhost scripts/deploy.js
        ```
    * proceed to launch the front-end
       ```bash
          npm run dev
        ```
3. Proceed to open the [localhost](http://localhost:3000/)

## Author/s

Dana Rivera

## License

This project is licensed under the MIT License - see LICENSE for details
