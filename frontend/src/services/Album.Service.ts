import axios from 'axios'
import { AlbumStruct } from '../interfaces/Album.Interface'

class AlbumService {
	async getAll() {
		return (await axios.get<AlbumStruct[]>('/albums/get/all')).data
	}

	async getByID(id: number) {
		return (
			await axios.get<AlbumStruct>('/albums/get', {
				params: { id: id },
			})
		).data
	}

	async getUserAlbums(token: string | null) {
		return (
			await axios.get<AlbumStruct[]>('/albums/get/user', {
				headers: { Authorization: `Bearer ${token}` },
			})
		).data
	}

	async getUserFavoriteAlbums(token: string | null) {
		return (
			await axios.get<AlbumStruct[]>('/albums/get/user/favorites', {
				headers: { Authorization: `Bearer ${token}` },
			})
		).data
	}

	async searchAlbums(query: string | null) {
		return (
			await axios.get<AlbumStruct[]>(`/albums/search/?query=${query}`)
		).data
	}
}

export default new AlbumService()
