import multer from 'multer'
import sharp from 'sharp'
import path from 'path'

const uploadPath = path.join(__dirname, '../', 'uploads')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

function resizeImageMiddleware(req: Request, res: Response, next: NextFunction) {
    let compressedImageFileSavePath = path.join(__dirname, '../', 'uploads', 'thumbnail', `${new Date().getTime()}-640x480` + ".jpg")

    sharp(req.file?.path).resize(640, 480).jpeg({
        quality: 80,
        chromaSubsampling: '4:4:4',
    }).toFile(compressedImageFileSavePath, (err, info) => {
        if (err) {
            res.send(err)
        } else {
            res.send(info)
        }
        next(); // next() ni chaqirish
    });
}

// Middleware ko'rinishi
// export function resizeImage(req: Request, res: Response, next: NextFunction) {

//     const width = 640
//     const height = 480

//     let compressedFileName = `/thumbnail/${new Date().getTime()}-${width}x${height}.jpg`

//     let compressedImageFileSavePath = path.join(__dirname, '../../', 'upload', compressedFileName)

//     sharp(req.file?.path).resize(width, height).jpeg({
//         quality: 80,
//         chromaSubsampling: '4:4:4',
//     }).toFile(compressedImageFileSavePath, (err, info) => {
//         if (err) {
//             res.send(err)
//         } else {
//             res.locals.originalFile = req.file
//             res.locals.compressInfo = info

//             next()
//         }
//         next(err); // next() ni chaqirish
//     });
// }

////////////////////////////////////////////////////////
// For example
import express, { Request, Response, NextFunction } from 'express'
const app = express()

app.post('/upload', upload.single('file'), resizeImageMiddleware)

app.listen(3000, () => {
    console.log(`Server is running is ${3000}`);
})

