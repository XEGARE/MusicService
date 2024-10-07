import { useState, useEffect } from 'react'
import { Button, Slider, Space, Image, Divider } from 'antd'
import {
	FastBackwardOutlined,
	FastForwardOutlined,
	MutedOutlined,
	PauseCircleOutlined,
	PlayCircleOutlined,
	SoundOutlined,
} from '@ant-design/icons'
import { MusicPlayerStruct } from '../../interfaces/MusicPlayer.Interface'
import AlbumContentDrawer from './AlbumContentDrawer'

interface ComponentProps {
	audioRef: any
}

export default function AudioPlayer(props: ComponentProps) {
	const [isPlaying, setIsPlaying] = useState<boolean>(false)
	const [currentTime, setCurrentTime] = useState<number>(0)
	const [volume, setVolume] = useState<number>(50)
	const [duration, setDuration] = useState<number>(0)

	const [data, setData] = useState<MusicPlayerStruct>()
	const [currentSong, setCurrentSong] = useState('')
	const [currentSongIndex, setCurrentSongIndex] = useState(0)

	const [drawerState, setDrawerState] = useState(false)

	const handleVolumeChange = (newVolume: number) => {
		updateVolume(newVolume)
	}

	const togglePlay = () => {
		if (props.audioRef.current) {
			if (props.audioRef.current.paused) {
				updateSong(Number(localStorage.getItem('musicPlayerSongIndex')))
				props.audioRef.current.play()
			} else {
				setIsPlaying(false)
				props.audioRef.current.pause()
			}
		}
	}

	const handleTimeUpdate = () => {
		if (props.audioRef.current) {
			setCurrentTime(props.audioRef.current.currentTime)
		}
	}

	const handleSeek = (value: number) => {
		if (props.audioRef.current) {
			props.audioRef.current.currentTime = value
			setCurrentTime(value)
		}
	}

	const handleNext = () => {
		if (data) {
			if (currentSongIndex < data.songs.length - 1) {
				const newIndex = currentSongIndex + 1
				updateSong(newIndex)
				localStorage.setItem(
					'musicPlayerSongIndex',
					newIndex.toString()
				)
			} else if (props.audioRef.current) {
				props.audioRef.current.pause()
			}
		}
	}

	const handlePrevious = () => {
		if (currentSongIndex > 0) {
			const newIndex = currentSongIndex - 1
			updateSong(newIndex)
			localStorage.setItem('musicPlayerSongIndex', newIndex.toString())
		} else if (props.audioRef.current) {
			props.audioRef.current.pause()
		}
	}

	useEffect(() => {
		updateSong(Number(localStorage.getItem('musicPlayerSongIndex')))
		if (localStorage.getItem('musicPlayerVolume')) {
			updateVolume(Number(localStorage.getItem('musicPlayerVolume')))
		} else {
			updateVolume(50)
		}

		if (props.audioRef.current) {
			props.audioRef.current.addEventListener(
				'loadedmetadata',
				handleLoadedMetadata
			)
			props.audioRef.current.addEventListener('play', handleStartPlay)
			props.audioRef.current.addEventListener('pause', handleStopPlay)
			return () => {
				if (props.audioRef.current) {
					props.audioRef.current.removeEventListener(
						'loadedmetadata',
						handleLoadedMetadata
					)
					props.audioRef.current.removeEventListener(
						'play',
						handleStartPlay
					)
					props.audioRef.current.removeEventListener(
						'pause',
						handleStopPlay
					)
				}
			}
		}
	}, [])

	const handleLoadedMetadata = () => {
		if (props.audioRef.current) {
			setDuration(props.audioRef.current.duration)
		}
	}

	const handleStartPlay = () => {
		if (props.audioRef.current) {
			updateSong(Number(localStorage.getItem('musicPlayerSongIndex')))
			setIsPlaying(true)
		}
	}

	const handleStopPlay = () => {
		if (props.audioRef.current) {
			updateSong(Number(localStorage.getItem('musicPlayerSongIndex')))
		}
	}

	const updateSong = (index: number) => {
		if (localStorage.getItem('musicPlayerData') != null) {
			setCurrentSongIndex(index)
			const storedData = JSON.parse(
				localStorage.getItem('musicPlayerData') as string
			)
			setData(storedData)
			setCurrentSong(`/files/song/?id=${storedData.songs[index].id}`)
		}
	}

	const updateVolume = (value: number) => {
		setVolume(value)
		localStorage.setItem('musicPlayerVolume', value.toString())
		if (props.audioRef.current) {
			props.audioRef.current.volume = value / 100
		}
	}

	const formatTime = (time: number): string => {
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
	}

	return (
		<Space
			wrap
			size='small'
			style={{
				display: 'flex',
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				alignItems: 'center',
				justifyContent: 'center',
				padding: 10,
				background: '#fff',
				borderTop: '2px solid #f6f5f3',
			}}
		>
			<audio
				autoPlay={isPlaying}
				ref={props.audioRef}
				src={currentSong}
				onTimeUpdate={handleTimeUpdate}
				onEnded={handleNext}
			/>

			<Space size='small'>
				<Button
					onClick={handlePrevious}
					shape='circle'
					size='large'
					icon={<FastBackwardOutlined />}
					disabled={currentSongIndex === 0 || data == null}
				/>

				<Button
					onClick={togglePlay}
					shape='circle'
					size='large'
					style={{
						width: '60px',
						height: '60px',
					}}
					icon={
						isPlaying ? (
							<PauseCircleOutlined style={{ fontSize: '175%' }} />
						) : (
							<PlayCircleOutlined style={{ fontSize: '175%' }} />
						)
					}
					disabled={data == null}
				/>

				<Button
					onClick={handleNext}
					shape='circle'
					size='large'
					icon={<FastForwardOutlined />}
					disabled={
						currentSongIndex + 1 === data?.songs.length ||
						data == null
					}
				/>
			</Space>

			<Space
				direction='vertical'
				size='small'
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				{data && (
					<Space size='small'>
						<Image
							src={`/files/picture/?id=${data.picture_id}`}
							width={50}
							height={50}
							preview={false}
							onClick={() => {
								setDrawerState(true)
							}}
							style={{ cursor: 'pointer' }}
						/>
						<Divider type='vertical' />
						<h3>{data.songs[currentSongIndex].name}</h3>
					</Space>
				)}

				<Space size='small'>
					{data && <p>{formatTime(currentTime)}</p>}

					<Slider
						min={0}
						max={
							props.audioRef.current
								? props.audioRef.current.duration
								: 0
						}
						value={currentTime}
						onChange={handleSeek}
						disabled={!isPlaying}
						style={{ width: 'calc(100vw*0.35)' }}
						tooltip={{ open: false }}
					/>

					{data && duration && <p>{formatTime(duration)}</p>}
				</Space>
			</Space>

			<Space size='small'>
				{volume === 0 ? (
					<MutedOutlined style={{ fontSize: '175%' }} />
				) : (
					<SoundOutlined style={{ fontSize: '175%' }} />
				)}
				<Slider
					value={volume}
					max={100}
					onChange={handleVolumeChange}
					style={{ width: '100px' }}
				/>
			</Space>
			{drawerState && data && (
				<AlbumContentDrawer
					albumData={data}
					open={drawerState}
					handleOpen={setDrawerState}
					audioRef={props.audioRef}
				/>
			)}
		</Space>
	)
}
