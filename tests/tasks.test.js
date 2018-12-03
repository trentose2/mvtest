const db = require('../controllers/db');

const functions = ['getAll', 'getOne', 'create', 'update', 'delete'];

const RIGHTS = {
	id_user: expect.any(Number),
	owner: expect.any(Boolean),
	modifier: expect.any(Boolean)
};

const EXPECTED_TASK = {
	id: expect.any(Number),
	text: expect.any(String),
	points: expect.any(Number),
	type: expect.any(String)
};

const EXPECTED_TASK_RIGHTS = {
	id: expect.any(Number),
	text: expect.any(String),
	points: expect.any(Number),
	type: expect.any(String),
	users: expect.arrayContaining([RIGHTS])
};

var taskId = null;

test('Function Definition', () => {
	for (method of functions) {
		expect(db.task[method]).toBeDefined();
	}
});

test('create should return the new task\'s id', () => {
	let task = {
			id_type: 1,
			text: "{ \"question\": \"sample question\" }",
			points: 10,
			users: [{
				id_user: 1,
				owner: true,
				modifier: true
			}, {
				id_user: 3,
				owner: false,
				modifier: false
			}]
		},
		expected = {
			id: expect.any(Number)
		};

	return db.task.create(task).then((res) => {
		taskId = parseInt(res.id);
		expect(res).toMatchObject(expected);
	});
});

test('getAll should return an array of tasks', () => {
	return expect(db.task.getAll()).resolves.toEqual(expect.arrayContaining([EXPECTED_TASK]));
});

test('getOne with wrong id should reject error', () => {
	return expect(db.task.getOne(-1)).rejects.toThrow();
});

test('getOne should return a task', () => {
	return expect(db.task.getOne(taskId)).resolves.toMatchObject(EXPECTED_TASK_RIGHTS);
});


test('update with wrong id should reject an error', () => {
	let task = {
		id_type: 1,
		text: "{ \"question\": \"not the same sample question\" }",
		points: 15,
		users: [{
			id_user: 1,
			owner: true,
			modifier: true
		}, {
			id_user: 3,
			owner: false,
			modifier: true
		}]
	}

	return expect(db.task.update(-1, task)).rejects.toBeInstanceOf(Error);
});

test('update should update and return a task', () => {
	let task = {
		id_type: 1,
		text: "{ \"question\": \"not the same sample question\" }",
		points: 15,
		users: [{
			id_user: 1,
			owner: true,
			modifier: true
		}, {
			id_user: 3,
			owner: false,
			modifier: true
		}]
	}

	return expect(db.task.update(taskId, task)).resolves.toMatchObject(task);
});

test('delete should delete a task', () => {
	return expect(db.task.delete(taskId)).resolves.toBeUndefined();
});

test('delete with wrong id should reject an error', () => {
	return expect(db.task.delete(taskId)).rejects.toBeInstanceOf(Error);
});

afterAll(() => {
	db.close();
});