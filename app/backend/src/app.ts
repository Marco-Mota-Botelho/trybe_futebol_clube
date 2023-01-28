import * as express from 'express';
import loginRoute from './routes/login.route';
import teamsRoute from './routes/teams.route';
import matchesRoute from './routes/matches.route';

class App {
  public app: express.Express;
  // errorMiddleware: ErrorMiddleware;

  constructor() {
    this.app = express();

    this.config();

    // Não remover essa rota
    this.app.use('/login', loginRoute);
    this.app.use('/teams', teamsRoute);
    this.app.use('/matches', matchesRoute);
    this.app.get('/', (req, res) => res.json({ ok: true }));
    // this.app.use();
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// Essa segunda exportação é estratégica, e a execução dos testes de cobertura depende dela
export const { app } = new App();

// Initial Commit
