const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login');
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/soundboard' });
  });
};

const getCurrentAccountId = (req, res) => {
  if (req.session.account) {
    return res.json({ accountId: req.session.account._id });
  }
  return res.status(401).json({ error: 'Not logged in!' });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/soundboard' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occurred' });
  }
};

const togglePremium = async (req, res) => {
  try {
    const accountId = req.session.account._id;

    // Find the account in the database
    const account = await Account.findById(accountId);

    // Toggle the premium status
    account.premium = !account.premium;

    // Save the updated account
    await account.save();

    // Respond with the updated account details
    res.status(200).json({
      message: 'Premium status updated successfully!',
      premium: account.premium,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating premium status!' });
  }
};

const getPremiumStatus = async (req, res) => {
  try {
    const accountId = req.session.account._id;

    // Find the account in the database
    const account = await Account.findById(accountId);

    // Respond with the premium status
    res.status(200).json({
      premium: account.premium,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving premium status!' });
  }
};

const changePassword = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  try {
    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(401).json({ error: 'Username does not exist!' });
    }

    const hash = await Account.generateHash(pass);
    account.password = hash;
    await account.save();

    return res.json({ message: 'Password changed successfully!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePassword,
  togglePremium,
  getPremiumStatus,
  getCurrentAccountId,
};
