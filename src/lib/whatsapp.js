import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
const {Client, LocalAuth} = pkg;
/*import {Client} from 'whatsapp-web.js';
import pkg from 'whatsapp-web.js';
const LocalAuth = pkg.default.LocalAuth;*/

const whatsapp = new Client({
    puppeteer: {
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	},
    authStrategy: new LocalAuth()
});

whatsapp.on('qr', qr => {
    qrcode.generate(qr, {
        small: true
    });
});

whatsapp.on('ready', () =>{
    console.log('El cliente está listo');
})

export default whatsapp;