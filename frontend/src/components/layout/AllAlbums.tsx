import { useQuery } from '@tanstack/react-query'
import albumService from '../../services/Album.Service'
import ShowAlbums from './ShowAlbums'
import { useState } from 'react'
import AlbumContentDrawer from './AlbumContentDrawer'
import { AlbumStruct } from '../../interfaces/Album.Interface'
import { TextStyles } from '../../styles/Text.Styles'
import { Space } from 'antd'
import NotFoundDataEvent from '../events/NotFoundData'
import LoadingDataEvent from '../events/LoadingData'
import ErrorDataEvent from '../events/ErrorData'

interface ComponentProps {
	audioRef: any
}

export default function AllAlbums(props: ComponentProps) {
	const { isLoading, isSuccess, isError, data } = useQuery({
		queryKey: ['allAlbumsData'],
		queryFn: () => albumService.getAll(),
	})

	const [drawerState, setDrawerState] = useState(false)
	const [albumData, setAlbumData] = useState<AlbumStruct>()

	const handleCardClick = (data: AlbumStruct) => {
		setAlbumData(data)
		setDrawerState(true)
	}

	if (isLoading) {
		return (
			<LoadingDataEvent
				message='Альбомы загружаются'
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
				title='К сожалению ничего не найдено'
				message='Попробуйте позже или создайте первый альбом.'
				picture='images/not-found-data.svg'
				width='50%'
			/>
		)
	}

	return (
		<>
			{isSuccess && data && (
				<Space direction='vertical' style={{ width: '100%' }}>
					<h1 style={TextStyles.infoText}>Каталог альбомов</h1>
					<ShowAlbums
						albumList={data}
						handleCardClick={handleCardClick}
					/>
					{drawerState && (
						<AlbumContentDrawer
							albumData={albumData}
							open={drawerState}
							handleOpen={setDrawerState}
							audioRef={props.audioRef}
						/>
					)}
				</Space>
			)}
		</>
	)
}
