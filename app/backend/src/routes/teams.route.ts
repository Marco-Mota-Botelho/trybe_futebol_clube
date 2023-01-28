import { Router } from 'express';
import TeamController from '../controller/teams.controller';

const router = Router();
const teamController = new TeamController();

router.get('/:id', teamController.getTeamById);
router.get('/', teamController.getAllTeams);

export default router;
