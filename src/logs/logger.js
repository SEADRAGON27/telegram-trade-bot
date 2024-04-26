import path from 'path';
import {pino} from 'pino';

const __dirname = path.resolve()
const logFilePath = path.resolve(__dirname,'src','logs','app.log')

export const logger = pino({
    transport: {
        targets: [
            {
                level: 'info',
                target: 'pino/file',
                options: { destination: logFilePath },
            },
        ],
    },
});