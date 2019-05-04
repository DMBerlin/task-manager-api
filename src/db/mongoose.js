const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE_CONNECT, {
	useNewUrlParser  : true,
	useCreateIndex   : true,
	useFindAndModify : false
});
