const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');
const PORT = process.env.PORT || 3000; // process.env accesses heroku's environment variables

app.use(express.static('dist'));

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(PORT, () => {
    console.log(__dirname);
    console.log(`listening on ${PORT}`);
})