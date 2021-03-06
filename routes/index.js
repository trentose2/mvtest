var express = require('express'),
	router = express.Router();
const db = require(__basedir + '/controllers/db');

router.get('/', (req, res) => {
	res.render('index', {
		page: 'home',
		title: 'Welcome to mvtest',
		objects: [{
			url: '/tasks',
			name: 'Tasks'
		}, {
			url: '/exams',
			name: 'Exams'
		}, {
			url: '/assignments',
			name: 'Assignments'
		}, {
			url: '/classes',
			name: 'Classes'
		}, {
			url: '/reviews',
			name: 'Reviews'
		}]
	});
});

router.get('/tasks', (req, res) => {
	db.task.getAll().then(data => {
		let tasks = [];
		for (let task of data) {
			tasks.push({
				url: '/tasks/' + task.id,
				name: task.text,
				small: task.type
			});
		}

		res.render('index', {
			page: 'tasks',
			title: 'Your Tasks',
			objects: tasks
		});
	});
});

router.get('/tasks/:id', (req, res) => {
	db.task.getOne(parseInt(req.params.id)).then(data => {
		// Temporary fix
		data.users = [{
			email: 'kekke'
		}];

		if (data.choices)
			data.choices = data.choices
		data.text = data.question

		res.render('task', {
			page: 'tasks',
			title: 'Task ' + data.id,
			task: data
		});
	}).catch(err => {
		res.render('error', {
			error: err
		})
	});
});

router.get('/exams', (req, res) => {
	res.render('index', {
		page: 'exams',
		title: 'Your Exams',
		objects: [{
			url: '/exams/1',
			name: 'SE Midterm',
			desc: 'First midterm for the Software engeneering course'
		}]
	})
});

module.exports = router;