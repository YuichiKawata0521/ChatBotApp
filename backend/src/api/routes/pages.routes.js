import express from 'express';
import path from 'path';
import { protect, authorizedRoles } from '../../middleware/auth.middleware.js';

const router = express.Router();
const publicDir = path.join(process.cwd(), 'public');

router.get(['/user/', '/user/index.html'], protect, (req, res) => {
    res.sendFile(path.join(publicDir, 'user/index.html'));
});

router.get(['/admin/', '/admin/index.html'], protect, authorizedRoles('admin'), (req, res) => {
    res.sendFile(path.join(publicDir, 'admin/index.html'));
});

export default router;