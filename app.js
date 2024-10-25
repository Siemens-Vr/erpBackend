const express = require('express');
const cors = require('cors');
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
const feeRouter = require('./routes/fee');

// Import the authentication middleware
const isAuthenticated = require('./middleware/isAuthenticated');  // Adjust the path if necessary

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',  // Replace with your frontend's URL
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  }));
app.use(express.json());

// Public Route: No authentication required for this route
app.use('/users', userRouter);

// Protected Routes: Apply `isAuthenticated` middleware to all other routes
app.use('/facilitators', isAuthenticated, facilitatorsRouter);
app.use('/staffs', isAuthenticated, staffRouter);
app.use('/levels', isAuthenticated, levelRouter);
app.use('/cohorts', isAuthenticated, cohortRouter);
app.use('/students', isAuthenticated, studentRouter);
app.use('/components', isAuthenticated, componentsRouter);
app.use('/borrow', isAuthenticated, borrowRouter);
app.use('/notifications', isAuthenticated, notificationsRouter);
app.use('/categories', isAuthenticated, categoriesRouter);
app.use('/job', isAuthenticated, notificationRoutes);
app.use('/items', isAuthenticated, itemsRoutes);
app.use('/suppliers', isAuthenticated, supplierRouter);
app.use('/projects', isAuthenticated, projectsRouter);
app.use('/fee', isAuthenticated, feeRouter);

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