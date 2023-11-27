const express = require('express');
const fs = require('fs');
const router = express.Router();

const dataPath = 'users.json';

const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{1,15}$/) 
});

const getUsers = () => {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
};

const saveUsers = (users) => {
    const data = JSON.stringify(users, null, 4);
    fs.writeFileSync(dataPath, data, 'utf8');
};

router.get('/', (req, res) => {
    const users = getUsers();
    res.json(users);
});

router.post('/', (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const users = getUsers();
    const newUser = { ...req.body, id: Date.now().toString() };
    users.push(newUser);
    saveUsers(users);
    res.status(201).json(newUser);
});

router.put('/:id', (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const users = getUsers();
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) {
        return res.status(404).send('User not found');
    }
    
    users[index] = { ...users[index], ...req.body };
    saveUsers(users);
    res.json(users[index]);
});

router.delete('/:id', (req, res) => {
    let users = getUsers();
    users = users.filter(u => u.id !== req.params.id);
    saveUsers(users);
    res.status(204).send();
});

module.exports = router;
