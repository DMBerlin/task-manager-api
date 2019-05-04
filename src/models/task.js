/**
 * Imported libs
 */
const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcryptjs');

/**
 * Creating a Task Schema
 */

const taskSchema = new mongoose.Schema(
	//Schema Definitions
	{
		description : {
			type     : String,
			required : true,
			trim     : true,
			validate(value) {
				if (value.length < 3) {
					throw new Error('Descrição precisa conter mais de 3 letras.');
				}
			}
		},
		completed   : {
			type    : Boolean,
			default : false
		},
		owner       : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		}
	},
	//Schema Options
	{
		timestamps : true
	}
);

/**
 * Pre ACTION before Saving
 */
taskSchema.pre('save', async function(next) {
	console.log('PRE Action before TASK SAVE');
	const task = this;

	//RE HASH before saving
	/*
	if (task.isModified('password')) {
		task.password = await bcrypt.hash(task.password, 8);
	}
	*/

	next();
});

/**
 * Task create model
 */
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
