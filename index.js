const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const MenuItem = require('./menuItemModel'); 

const app = express();
const port = 3010;

// Middleware
app.use(express.static('static'));
app.use(bodyParser.json());


const mongoURI = 'mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));


app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.put('/menu/:id', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, { name, description, price }, { new: true, runValidators: true });
    if (!menuItem) {
      return res.status(404).send('Menu item not found');
    }
    res.send(menuItem);
  } catch (error) {
    res.status(400).send('Error updating menu item');
  }
});

app.delete('/menu/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).send('Menu item not found');
    }
    res.send('Menu item deleted');
  } catch (error) {
    res.status(400).send('Error deleting menu item');
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
