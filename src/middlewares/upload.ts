import multer from 'multer';
import { resolve, extname } from 'path';
import { randomUUID as uuid } from 'crypto';

export const uploadPath = resolve(__dirname, '../../public/uploads')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, uuid() + extname(file.originalname));
    }
});

export const upload = multer({ storage })