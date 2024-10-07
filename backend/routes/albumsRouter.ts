import Router from 'express'
import albumsController from '../controllers/albumsController'

const router = Router()

router.post('/create', albumsController.createAlbum)
router.post('/update', albumsController.updateAlbum)
router.delete('/delete', albumsController.deleteAlbum)
router.get('/get', albumsController.getAlbumData)
router.get('/get/all', albumsController.getAllAlbums)
router.get('/get/user', albumsController.getUserAlbums)
router.get('/get/user/favorites', albumsController.getUserFavoriteAlbums)
router.get('/search', albumsController.searchAlbums)

export default router
