const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { Account, Transaction } = require("./models");
var cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// ping endpoint
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Create a new account
app.post("/api/accounts", async (req, res) => {
  try {
    const { name, balance } = req.body;
    const account = await Account.create({ id: uuidv4(), name, balance });
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all accounts
app.get("/api/accounts", async (req, res) => {
  try {
    const accounts = await Account.findAll();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new transaction
app.post("/api/transactions", async (req, res) => {
  try {
    const { account_id, amount, type } = req.body;
    const account = await Account.findByPk(account_id);

    if (!account) return res.status(404).json({ error: "Account not found" });

    if (type === "withdraw" && Number(account.balance) < Number(amount)) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const transaction = await Transaction.create({
      id: uuidv4(),
      account_id,
      amount,
      type,
    });

    if(type === "deposit") {
      account.balance = Number(account.balance) + Number(amount);
      console.log(account.balance);
    }
    else if (type === "withdraw"){
      account.balance = Number(account.balance) - Number(amount);
    } 

    await account.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.findAll({ order: [["createdAt", "DESC"]] });
    for (let i = 0; i < transactions.length; i++) {
      const account = await Account.findByPk(transactions[i].account_id);
      
      transactions[i].dataValues.account = account;
    }


    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
