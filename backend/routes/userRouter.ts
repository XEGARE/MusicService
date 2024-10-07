import Router from 'express'
import userController from '../controllers/userController'

const router = Router()

router.post('/signup', userController.signup)
router.post('/signin', userController.signin)
router.get('/token', userController.token)

router.post('/favorites', userController.addFavorites)
router.get('/favorites', userController.getFavorites)
router.delete('/favorites', userController.deleteFavorites)

export default router
