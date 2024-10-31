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
    account.dataValues.account_id = account.dataValues.id;
    account.balance = Number(account.balance);
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get specific account
app.get("/api/accounts/:id", async (req, res) => {
  try {
    const account = await Account.findByPk(req.params.id);
    if (!account) return res.status(404).json({ error: "Account not found" });
    account.dataValues.account_id = account.dataValues.id;
    account.balance = Number(account.balance);
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all accounts
app.get("/api/accounts", async (req, res) => {
  try {
    const accounts = await Account.findAll();
    for (let i = 0; i < accounts.length; i++) {
      accounts[i].dataValues.account_id = accounts[i].dataValues.id;
      accounts[i].balance = Number(accounts[i].balance);
    }

    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new transaction
app.post("/api/transactions", async (req, res) => {
  try {
    const { account_id, amount } = req.body;
    let account=null;
    account = await Account.findByPk(account_id);
    if (!account){
      account = await Account.create({ id: account_id, name: "New Account"+Math.floor(Math.random() * 1000), balance: 0 });
    }
    type="deposit";

    const transaction = await Transaction.create({
      id: uuidv4(),
      account_id,
      amount,
      type,
    });

    if(type === "deposit") {
      let balance = Number(account.balance);
      let newBalance = balance + Number(amount);
    
      account.balance =newBalance.toString();
      await account.save();
    }

    transaction.dataValues.transaction_id = transaction.dataValues.id;
    transaction.dataValues.amount = Number(transaction.dataValues.amount);

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
      transactions[i].dataValues.transaction_id = transactions[i].dataValues.id;
      transactions[i].dataValues.amount = Number(transactions[i].dataValues.amount);
    }


    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get specific transaction
app.get("/api/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });
    transaction.dataValues.transaction_id = transaction.dataValues.id;
    transaction.dataValues.amount = Number(transaction.dataValues.amount);
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
