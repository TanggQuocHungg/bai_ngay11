const express = require('express');
const router = express.Router();
const { Role, User } = require('../models');

// ================= ROLE API =================
router.post('/roles', async (req, res) => {
    try {
        const newRole = await Role.create(req.body);
        res.status(201).json(newRole);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

router.get('/roles', async (req, res) => {
    try {
        const roles = await Role.find({ isDeleted: false });
        res.json(roles);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/roles/:id', async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) return res.status(404).json({ message: 'Không tìm thấy Role' });
        res.json(role);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/roles/:id', async (req, res) => {
    try {
        const updatedRole = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false }, req.body, { new: true }
        );
        if (!updatedRole) return res.status(404).json({ message: 'Không tìm thấy Role' });
        res.json(updatedRole);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

router.delete('/roles/:id', async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!deletedRole) return res.status(404).json({ message: 'Không tìm thấy Role' });
        res.json({ message: 'Đã xoá mềm Role thành công' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ================= USER API =================
router.post('/users', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }).populate('role');
        res.json(users);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) return res.status(404).json({ message: 'Không tìm thấy User' });
        res.json(user);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false }, req.body, { new: true }
        );
        if (!updatedUser) return res.status(404).json({ message: 'Không tìm thấy User' });
        res.json(updatedUser);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!deletedUser) return res.status(404).json({ message: 'Không tìm thấy User' });
        res.json({ message: 'Đã xoá mềm User thành công' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// API 2: Enable
router.post('/enable', async (req, res) => {
    const { email, username } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false }, { status: true }, { new: true }
        );
        if (!user) return res.status(400).json({ message: 'Sai email hoặc username' });
        res.json({ message: 'Đã enable user', user });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// API 3: Disable
router.post('/disable', async (req, res) => {
    const { email, username } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false }, { status: false }, { new: true }
        );
        if (!user) return res.status(400).json({ message: 'Sai email hoặc username' });
        res.json({ message: 'Đã disable user', user });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// API 4: Lấy user theo role id
router.get('/roles/:id/users', async (req, res) => {
    try {
        const users = await User.find({ role: req.params.id, isDeleted: false });
        res.json(users);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;