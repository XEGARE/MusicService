import axios from 'axios'
import { FavoritesStruct } from '../interfaces/Favorites.Interface'

class UserService {
	async getFavorites(token: string | null) {
		return (
			await axios.get<FavoritesStruct[]>('/user/favorites', {
				headers: { Authorization: `Bearer ${token}` },
			})
		).data
	}
}

export default new UserService()
