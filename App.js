const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Import the cors package
const { sequelize } = require('./models');
const favoritesRouter = require('./routes/favorites');

const app = express();
app.use(cors()); // Use the cors middleware

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', favoritesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await sequelize.authenticate();
  console.log('Database connected!');
});
