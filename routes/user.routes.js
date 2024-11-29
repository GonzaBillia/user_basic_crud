const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.js');
const auth = require('../middleware/auth.js');

//Registrar usuario
router.post('/register', async (req, res) => {
    const {name, email, password } = req.body;

    try {
        const hashedPass = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPass });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
})

router.post( '/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({where: {email}});

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({error: 'Invalid Credentials'})
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({token})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.get('/' , auth, async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'name', 'email'] });
        res.json(users);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.put('/:id', auth, async(req, res) => {
    const {id} = req.params;
    const { name, email, password } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({error: 'User not found'});

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();
        res.status(201).json({message: 'User updated successfully', user});
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.delete('/:id', auth, async(req, res ) => {
    const {id} = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({error: 'user not found'});

        await user.destroy();
        res.status(200).json({message: 'User deleted successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

module.exports = router;