import express from 'express';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import misRutas from './routes/index.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import whatsapp from './lib/whatsapp.js';

//variables, constantes y objetos
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname =dirname(fileURLToPath(import.meta.url));

//whatsapp
whatsapp.initialize();

//settings
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', join(__dirname,'views'));
app.use(misRutas);

//recursos estáticos

app.use(express.static(join(__dirname,'public')));


app.listen(PORT, () => console.log("El servidor te está escuchando en el puerto: " + PORT));