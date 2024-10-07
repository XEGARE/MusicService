import { useQuery } from '@tanstack/react-query'
import albumService from '../../services/Album.Service'
import ShowAlbums from './ShowAlbums'
import { useState } from 'react'
import EditAlbum from '../modals/albums/EditAlbum'
import { AlbumStruct } from '../../interfaces/Album.Interface'
import { TextStyles } from '../../styles/Text.Styles'
import { Space } from 'antd'
import LoadingDataEvent from '../events/LoadingData'
import ErrorDataEvent from '../events/ErrorData'
import NotFoundDataEvent from '../events/NotFoundData'

export default function UserAlbums() {
	const { isLoading, isSuccess, isError, data } = useQuery({
		queryKey: ['userAlbumsData'],
		queryFn: () =>
			albumService.getUserAlbums(localStorage.getItem('token')),
	})
	const [editAlbumState, setEditAlbumState] = useState(false)
	const [albumData, setAlbumData] = useState<AlbumStruct>()

	const handleCardClick = (data: AlbumStruct) => {
		setAlbumData(data)
		setEditAlbumState(true)
	}

	if (isLoading) {
		return (
			<LoadingDataEvent
				message='Ваши альбомы загружаются'
				picture='images/getting.svg'
				width='50%'
			/>
		)
	}

	if (isError) {
		return (
			<ErrorDataEvent
				title='К сожалению произошла ошибка'
				message='Повторите попытку позже'
				picture='images/error.svg'
				width='50%'
			/>
		)
	}

	if (isSuccess && !data) {
		return (
			<NotFoundDataEvent
				title='Ваши альбомы не найдены'
				message='Создайте свой первый альбом.'
				picture='images/not-found-data.svg'
				width='50%'
			/>
		)
	}

	return (
		<>
			{isSuccess && data && (
				<Space direction='vertical' style={{ width: '100%' }}>
					<h1 style={TextStyles.infoText}>Ваши альбомы</h1>
					<ShowAlbums
						albumList={data}
						handleCardClick={handleCardClick}
					/>
					{editAlbumState && (
						<EditAlbum
							isOpen={editAlbumState}
							handleOpen={setEditAlbumState}
							albumData={albumData}
						/>
					)}
				</Space>
			)}
		</>
	)
}
