import { SongsListStruct } from './SongsList.Interface'

export interface MusicPlayerStruct {
	title: string
	description: string
	picture_id: number
	songs: SongsListStruct[]
}
