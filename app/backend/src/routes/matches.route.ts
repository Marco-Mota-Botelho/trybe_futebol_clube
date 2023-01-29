import { Router } from 'express';
import validateToken from '../auth/tokenValidation';
import MatchController from '../controller/matches.controller';

const router = Router();
const matchController = new MatchController();

// router.get('/:id', teamController.getTeamById);
router.get('/', matchController.getAll);
router.post('/', validateToken, matchController.createMatch);
router.patch('/:id/finish', validateToken, matchController.finishMatch);

export default router;
