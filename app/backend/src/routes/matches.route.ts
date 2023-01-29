import { Router } from 'express';
import { validateTeams, validateTeamsId } from '../middlewares/matches.middlewares';
import validateToken from '../auth/tokenValidation';
import MatchController from '../controller/matches.controller';

const router = Router();
const matchController = new MatchController();

// router.get('/:id', teamController.getTeamById);
router.get('/', matchController.getAll);
router.post('/', validateToken, validateTeams, validateTeamsId, matchController.createMatch);
router.patch('/:id/finish', validateToken, matchController.finishMatch);
router.patch('/:id', validateToken, matchController.updateMatch);

export default router;
