import { SongStruct } from './Song.Interface'

export interface AlbumStruct {
	id: number
	title: string
	description: string
	user_id: number
	picture_id: number
	songs: SongStruct[]
}
