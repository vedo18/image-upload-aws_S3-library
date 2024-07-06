const uploadController = require('./controllers/uploadController');

module.exports = uploadController;

//testing through server
// const express = require('express');
// const uploadRoutes = require('./routes/image-route');

// const app = express();
// const port = 4000;

// app.use(express.json({ limit: '10mb' })); // To handle large base64 encoded files
// app.use('/api', uploadRoutes);

// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });
