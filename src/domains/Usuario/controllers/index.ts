import { Router } from 'express';
import account from './account.js'
import create from './create.js'
import access from './access.js'
import admin from './admin.js'

const router = Router();

router.use('/account', account);
router.use('/', create);
router.use('/', access);
router.use('/', admin);


export default router;