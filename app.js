const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Import the routes
const studentRouter = require('./routes/students');
const cohortRouter = require('./routes/cohort');
const levelRouter = require('./routes/level');
const staffRouter = require('./routes/staff');
const facilitatorsRouter = require('./routes/facilitator');
const userRouter = require('./routes/users');
const componentsRouter = require('./routes/component');
const borrowRouter = require('./routes/borrow');
const notificationsRouter = require('./routes/notification');
const notificationRoutes = require('./routes/job');
const categoriesRouter = require('./routes/categories');
const itemsRoutes = require('./routes/itemsRoutes');
const supplierRouter = require('./routes/suppliers');
const projectsRouter = require('./routes/projects');
const phasesRouter = require('./routes/phases');
const assigneesRouter = require('./routes/assignees');
const deliverablesRouter = require('./routes/deliverables');
const feeRouter = require('./routes/fee');
const documentsRouter = require('./routes/documentRoutes');
const staffDocumentsRouter = require('./routes/staffDocuments');
const folderRouter = require('./routes/folder');
const subFolderRouter = require('./routes/subFolder');
const weekRouter = require('./routes/weeks');
const materialRouter = require('./routes/materials');



// Import the authentication middleware
const isAuthenticated = require('./middleware/isAuthenticated');  // Adjust the path if necessary
const documents = require('./models/documents');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ' http://localhost:3000',  // Replace with your frontend's URL
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  }));
app.use(express.json());

// Public Route: No authentication required for this route
app.use('/users', userRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/staffUploads', express.static(path.join(__dirname, 'staffUploads')));

// Protected Routes: Apply `isAuthenticated` middleware to all other routes
app.use('/facilitators', facilitatorsRouter);
app.use('/staffs', staffRouter);
app.use('/levels', levelRouter);
app.use('/cohorts', cohortRouter);
app.use('/students', studentRouter);
app.use('/components', componentsRouter);
app.use('/borrow', borrowRouter);
app.use('/notifications', notificationsRouter);
app.use('/categories', categoriesRouter);
app.use('/job', notificationRoutes);
app.use('/items', itemsRoutes);
app.use('/suppliers', supplierRouter);
app.use('/projects', projectsRouter);
app.use('/phases', phasesRouter);
app.use('/assignees', assigneesRouter);
app.use('/deliverables', deliverablesRouter);
app.use('/fee', feeRouter);
app.use('/documents',documentsRouter);
app.use('/staffDocuments',staffDocumentsRouter);
app.use('/folders',folderRouter);
app.use('/subFolders',subFolderRouter);
app.use('/weeks',weekRouter);
app.use('/materials',materialRouter);


// Test route to verify server is running
app.get("/", (req, res) => {
    res.send('Hello world');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





// const express = require('express')
// const cors = require('cors')
// require('dotenv').config();
// const studentRouter = require('./routes/students')
// const cohortRouter = require('./routes/cohort')
// const levelRouter = require('./routes/level')
// const staffRouter = require('./routes/staff')
// const facilitatorsRouter = require('./routes/facilitator')
// const userRouter = require('./routes/users')
// const componentsRouter = require('./routes/component')
// const borrowRouter = require('./routes/borrow')
// const notificationsRouter = require('./routes/notification')
// const notificationRoutes = require('./routes/job'); // Adjust the path as necessary
// const categoriesRouter = require('./routes/categories')
// const itemsRoutes = require('./routes/itemsRoutes')
// const supplierRouter = require('./routes/suppliers');
// const projectsRouter = require('./routes/projects');
// const feeRouter = require('./routes/fee')




// const app = express()
// const PORT = process.env.PORT  || 5000
// // Adjust CORS settings to allow your frontend domain
// // app.use(cors({
// //     origin: 'https://vmlab.dkut.ac.ke',  // Allow this specific origin
// //     methods: 'GET,POST,PUT,DELETE',  // Allow these methods
// //     allowedHeaders: 'Content-Type,Authorization',  // Allow these headers
// //     credentials: true,  // Allow cookies and authorization headers if necessary
// // }));

// // const corsOptions = {
// //     origin: 'https://vmlab.dkut.ac.ke',

// //     optionsSuccessStatus: 200
// // };

// app.use(cors());
// app.use(express.json())

// app.get("/", (req, res)=>{
//     res.send('Hello world')
// })

// app.use('/users', userRouter)
// app.use('/facilitators', facilitatorsRouter)
// app.use('/staffs', staffRouter )
// app.use('/levels', levelRouter)
// app.use('/cohorts', cohortRouter)
// app.use('/students', studentRouter)

// app.use('/components', componentsRouter);
// app.use('/borrow', borrowRouter)
// app.use('/notifications', notificationsRouter)
// app.use('/categories', categoriesRouter)
// app.use('/job', notificationRoutes)
// app.use('/items', itemsRoutes);
// app.use('/suppliers', supplierRouter);

// app.use('/projects', projectsRouter)
// app.use('/fee', feeRouter)










// app.listen(PORT, ()=>{
//     console.log(`Server is running on port ${PORT}`)
// })