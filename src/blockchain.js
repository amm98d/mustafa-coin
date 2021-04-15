const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(data) {
        this.timestamp = Date.now();
        this.data = data;
        this.previousHash;
        this.hash;
    }

    calculateHash() {
        return SHA256(this.timestamp + this.data + this.previousHash).toString();
    }
}

class Blockchain {
    constructor() {
        var genesisBlock = new Block('0');
        genesisBlock.previousHash = 'null';
        genesisBlock.hash = genesisBlock.calculateHash();
        this.chain = [genesisBlock];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.chain[this.chain.length - 1].hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    verifyIntegrity() {
        for (let i = 1; i < this.chain.length; i++) {
            // comparing stored hash with new hash to check for any tampering in block
            if (this.chain[i].hash !== this.chain[i].calculateHash())
                return false;
            // checking if node is connected with previous node by hash+previous.hash
            else if (this.chain[i].previousHash !== this.chain[i - 1].hash) {
                return false;
            }
        }
        return true;
    }

    getBalance(walletAddress) {
        let balance = 0;
        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === walletAddress) {
                    balance -= transaction.amount;
                } else if (transaction.toAddress === walletAddress) {
                    balance += transaction.amount;
                }
            }
        }
        return balance;
    }

}

module.exports.Blockchain = Blockchain;
// class Blockchain {
//     constructor(difficulty = 2, miningReward = 100) {
//         var genesisBlock = new Block([]);
//         genesisBlock.previousHash = 'null';
//         genesisBlock.hash = genesisBlock.calculateHash();

//         this.chain = [genesisBlock];
//         this.difficulty = difficulty;
//         this.pendingTransactions = [];
//         this.miningReward = miningReward;
//     }

//     addBlock(newBlock) {
//         newBlock.previousHash = this.chain[this.chain.length - 1].hash;
//         newBlock.mineBlock(this.difficulty);
//         this.chain.push(newBlock);
//     }

//     verifyIntegrity() {
//         for (let i = 1; i < this.chain.length; i++) {
//             // verify transactions with respect to public-private keys
//             if (!this.chain[i].hashValidTransactions()) return false;
//             // comparing stored hash with new hash to check for any tampering in block
//             if (this.chain[i].hash !== this.chain[i].calculateHash())
//                 return false;
//             // checking if node is connected with previous node by hash+previous.hash
//             else if (this.chain[i].previousHash !== this.chain[i - 1].hash) {
//                 return false;
//             }
//         }
//         return true;
//     }

//     minePendingTransactions(miningRewardAddress) {
//         console.log("Starting Miner " + miningRewardAddress);
//         let pendingBlock = new Block(this.pendingTransactions);
//         this.addBlock(pendingBlock);
//         this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
//     }

//     performTransaction(transaction) {
//         if (!transaction.isValid())
//             throw new Error("Invalid transaction!");
//         this.pendingTransactions.push(transaction);
//     }

//     getBalance(walletAddress) {
//         let balance = 0;
//         for (const block of this.chain) {
//             for (const transaction of block.transactions) {
//                 if (transaction.fromAddress === walletAddress) {
//                     balance -= transaction.amount;
//                 } else if (transaction.toAddress === walletAddress) {
//                     balance += transaction.amount;
//                 }
//             }
//         }
//         return balance;
//     }

// }