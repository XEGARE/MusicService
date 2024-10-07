import { useQuery, useQueryClient } from '@tanstack/react-query'
import albumService from '../../services/Album.Service'
import { Card, Divider, Drawer, FloatButton, Space } from 'antd'
import { TextStyles } from '../../styles/Text.Styles'
import LoadingDataEvent from '../events/LoadingData'
import ErrorDataEvent from '../events/ErrorData'
import NotFoundDataEvent from '../events/NotFoundData'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { FavoritesStruct } from '../../interfaces/Favorites.Interface'
import Message from '../utils/messages'
import { blue } from '@ant-design/colors'

interface ComponentProps {
	albumData: any
	open: boolean
	handleOpen: any
	audioRef: any
}

export default function AlbumContentDrawer(props: ComponentProps) {
	const queryClient = useQueryClient()

	const { isSuccess, isLoading, isError, data } = useQuery({
		queryKey: ['albumContentData'],
		queryFn: () => albumService.getByID(props.albumData.id),
	})

	const [isFavorites, setIsFavorites] = useState(false)

	const [isUseInPlayer, setIsUseInPlayer] = useState(false)
	const [songIndex, setSongIndex] = useState(-1)

	const handleClose = () => {
		queryClient.removeQueries({
			queryKey: ['albumContentData'],
			exact: true,
		})
		props.handleOpen(false)
	}

	const handleCardClick = async (index: number) => {
		setIsUseInPlayer(true)
		setSongIndex(index)
		localStorage.setItem('musicPlayerSongIndex', index.toString())

		if (data) {
			var musicData = JSON.parse(JSON.stringify(data))
			delete musicData.user_id
			delete musicData.songs

			var songsArrayObject: any[] = []
			data.songs.map((song) =>
				songsArrayObject.push({
					id: song.id,
					name: song.name,
					type: song.type,
				})
			)

			musicData.songs = songsArrayObject

			localStorage.setItem('musicPlayerData', JSON.stringify(musicData))

			if (props.audioRef.current) {
				props.audioRef.current.src = `/files/song/?id=${songsArrayObject[index].id}`
				props.audioRef.current.play()
			}
		}
	}

	const handleFavoriteButton = () => {
		if (isFavorites) {
			localStorage.removeItem('userFavorites')
		}
		fetch(`/user/favorites/?id=${props.albumData.id}`, {
			method: isFavorites ? 'delete' : 'post',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		}).then((res) => {
			res.json()
				.then((data) => {
					if (res.ok) {
						Message.success(data.message)
						setIsFavorites(!isFavorites)
						queryClient.invalidateQueries({
							queryKey: ['userFavoritesData'],
						})
						queryClient.invalidateQueries({
							queryKey: ['userFavoriteAlbumsData'],
						})
					} else {
						throw new Error(data.message)
					}
				})
				.catch((error) => {
					console.error(error)
				})
		})
	}

	useEffect(() => {
		const storedFavoritesData: FavoritesStruct[] = JSON.parse(
			localStorage.getItem('userFavorites') as string
		)
		if (storedFavoritesData) {
			storedFavoritesData.map((item) => {
				if (item.album_id == props.albumData.id) {
					setIsFavorites(true)
				}
			})
		}

		const storedPlayerData = JSON.parse(
			localStorage.getItem('musicPlayerData') as string
		)
		if (storedPlayerData) {
			if (props.albumData.id == storedPlayerData.id) {
				setIsUseInPlayer(true)
				setSongIndex(
					Number(localStorage.getItem('musicPlayerSongIndex'))
				)
			}
		}
	})

	return (
		<Drawer
			title={props.albumData.title}
			placement='right'
			onClose={handleClose}
			open={props.open}
			getContainer={'body'}
		>
			<p style={TextStyles.infoText}>
				<b>Описание:</b> {props.albumData.description}
			</p>

			<Divider />

			{isLoading && (
				<LoadingDataEvent
					message='Подождите, данные загружаются'
					picture='images/getting.svg'
					width='100%'
				/>
			)}

			{isError && (
				<ErrorDataEvent
					title='К сожалению произошла ошибка'
					message='Повторите попытку позже'
					picture='images/error.svg'
					width='100%'
				/>
			)}

			{isSuccess && !data && (
				<NotFoundDataEvent
					title='К сожалению данные отсутствуют'
					message='Повторите попытку позже'
					picture='images/not-found-data.svg'
					width='100%'
				/>
			)}

			{isSuccess && (
				<>
					{data.songs[0].id ? (
						<Space
							direction='vertical'
							style={{
								display: 'flex',
							}}
						>
							<h1 style={TextStyles.infoText}>Содержимое</h1>
							{data.songs.map((song, index) => (
								<Card
									key={index}
									hoverable
									onClick={() => handleCardClick(index)}
									style={
										isUseInPlayer && songIndex == index
											? {
													background: blue.primary,
													color: 'white',
											  }
											: {
													background: 'none',
													color: 'black',
											  }
									}
								>
									<h4 style={TextStyles.infoText}>
										{song.name}
									</h4>
								</Card>
							))}
						</Space>
					) : (
						<NotFoundDataEvent
							title='К сожалению данные отсутствуют'
							message='Автор альбома не загрузил музыку'
							picture='images/not-found-data.svg'
							width='100%'
						/>
					)}

					{localStorage.getItem('token') && (
						<FloatButton
							tooltip={
								isFavorites ? (
									<div>Удалить из избранного</div>
								) : (
									<div>Добавить в избранное</div>
								)
							}
							icon={
								isFavorites ? (
									<HeartFilled style={{ color: 'red' }} />
								) : (
									<HeartOutlined />
								)
							}
							onClick={handleFavoriteButton}
						/>
					)}
				</>
			)}
		</Drawer>
	)
}
