import { app } from './config/expressConfig.js';


app.listen(process.env.PORT_API, () => {
    console.log(`Servidor hosteado na porta ${process.env.PORT_API}`);
});
