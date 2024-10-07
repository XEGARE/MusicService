import Router from 'express'
import FilesController from '../controllers/filesController'

import { picturesFolder, songsFolder } from '../config.json'

import multer from 'multer'
const uploadPicture = multer({ dest: `../../${picturesFolder}` })
const uploadSong = multer({ dest: `../../${songsFolder}` })

const router = Router()

router.post(
	'/upload/picture',
	uploadPicture.single('picture'),
	FilesController.uploadPicture
)
router.delete('/delete/picture', FilesController.deletePicture)
router.get('/picture', FilesController.getPicture)

router.post(
	'/upload/song',
	uploadSong.array('song', 12),
	FilesController.uploadSong
)
router.delete('/delete/song', FilesController.deleteSong)
router.get('/song', FilesController.getSong)

export default router
