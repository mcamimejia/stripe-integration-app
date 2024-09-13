import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import routes from './routes';

dotenv.config();

const app: Application = express();

app.use(cors({ origin: process.env.UI_URL }));
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 4000;

sequelize.sync({ force: false }).then(() => {
    console.log('Database set');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});