import { useQuery } from '@tanstack/react-query'
import albumService from '../../services/Album.Service'
import ShowAlbums from './ShowAlbums'
import { useState } from 'react'
import AlbumContentDrawer from './AlbumContentDrawer'
import { AlbumStruct } from '../../interfaces/Album.Interface'
import { TextStyles } from '../../styles/Text.Styles'
import { Space } from 'antd'
import Function from '../utils/functions'
import LoadingDataEvent from '../events/LoadingData'
import NotFoundDataEvent from '../events/NotFoundData'
import ErrorDataEvent from '../events/ErrorData'

interface ComponentProps {
	audioRef: any
	searchQuery: string
}

export default function AllAlbums(props: ComponentProps) {
	const { isLoading, isSuccess, isError, data } = useQuery({
		queryKey: ['searchAlbumsData'],
		queryFn: () => albumService.searchAlbums(props.searchQuery),
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
				message='Идёт поиск'
				picture='images/searching.svg'
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
				title='К сожалению, по Вашему запросу ничего не найдено'
				message='Попробуйте воспользоваться каталогом альбомов или измените свой запрос.'
				picture='images/not-found-data.svg'
				width='50%'
			/>
		)
	}

	return (
		<>
			{isSuccess && data && (
				<Space direction='vertical' style={{ width: '100%' }}>
					<h1 style={TextStyles.infoText}>
						По вашему запросу{' '}
						{Function.declination(data.length, [
							'найден',
							'найдено',
							'найдено',
						])}{' '}
						{data.length}{' '}
						{Function.declination(data.length, [
							'альбом',
							'альбома',
							'альбомов',
						])}
					</h1>
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
