import { Router } from 'express';
import LeaderboardController from '../controller/leaderboard.controller';

const router = Router();
const leaderboardController = new LeaderboardController();

router.get('/home', leaderboardController.getLeaderboardsHome);

export default router;
