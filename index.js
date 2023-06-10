const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
// use middleware
app.use(cors());
app.use(express.json());
// Home page
app.get('/', (req, res) => {
    res.send('Server is running');
});

//MongoDB connection




app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});