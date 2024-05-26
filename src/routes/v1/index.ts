import { Router } from 'express';
import auth from './auth.route';
import triggers from './triggers.route';

const router = Router();

router.use('/auth', auth);
router.use('/triggers', triggers);

export default router;
