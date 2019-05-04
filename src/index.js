require('./db/mongoose');
const express = require('express');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

/**
 * Setting up Express configs
 */
app.use(express.json());

/**
 * Setting up App Routers
 */
app.use(userRouter);
app.use(taskRouter);

/**
 * Iniciar App na porta 3000
 */
app.listen(port, () => {
	console.log('Server is up on port ' + port);
});
