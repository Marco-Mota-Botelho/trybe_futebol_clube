import { Router } from 'express';
import MatchController from '../controller/matches.controller';

const router = Router();
const matchController = new MatchController();

// router.get('/:id', teamController.getTeamById);
router.get('/', matchController.getAll);
router.post('/', matchController.createMatch);

export default router;
