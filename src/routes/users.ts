import { Router } from 'express';
import {
  getUsers, getCurrentUser, getUserById, updateUser, updateAvatar,
} from '../controllers/user';

import { avatarValidation, userValidation, idValidation } from '../utils/validation';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', idValidation, getUserById);
router.patch('/me', userValidation, updateUser);
router.get('/me', getCurrentUser);
router.patch('/me/avatar', avatarValidation, updateAvatar);

export default router;
