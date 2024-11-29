const express = require('express');
const userRoutes = require('./routes/user.routes.js');
const bodyParser = require('body-parser');
const { sequelize } = require('./models/user.js');
const cors = require('cors');

const app = express();
app.use(cors())
app.use(bodyParser.json());

app.use('/users', userRoutes);

sequelize.sync({force: false}).then(() => {
    console.log('Database connected');
    app.listen(3000, () => console.log('Server running on port 3000'));
});
