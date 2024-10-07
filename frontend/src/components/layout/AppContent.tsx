import { Layout } from 'antd'
import AllAlbums from './AllAlbums'
import UserAlbums from './UserAlbums'
import SearchAlbums from './SearchAlbums'
import AudioPlayer from './AudioPlayer'
import { useRef } from 'react'
import FavoriteAlbums from './FavoriteAlbums'

const contentStyle: React.CSSProperties = {
	minHeight: '100vh',
	color: '#000',
	backgroundColor: '#fff',
	padding: '10px 20px 250px 20px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'start',
}

interface ComponentProps {
	isShowUserAlbums: boolean
	isShowUserFavoriteAlbums: boolean
	isUseSearch: boolean
	searchQuery: string
}

export default function AppContent(props: ComponentProps) {
	const audioRef = useRef<HTMLAudioElement>(null)

	return (
		<Layout.Content style={contentStyle}>
			{!props.isShowUserAlbums &&
				!props.isShowUserFavoriteAlbums &&
				!props.isUseSearch && <AllAlbums audioRef={audioRef} />}

			{props.isShowUserAlbums &&
				!props.isShowUserFavoriteAlbums &&
				!props.isUseSearch && <UserAlbums />}

			{props.isUseSearch &&
				!props.isShowUserAlbums &&
				!props.isShowUserFavoriteAlbums && (
					<SearchAlbums
						audioRef={audioRef}
						searchQuery={props.searchQuery}
					/>
				)}

			{props.isShowUserFavoriteAlbums &&
				!props.isShowUserAlbums &&
				!props.isUseSearch && <FavoriteAlbums audioRef={audioRef} />}

			<AudioPlayer audioRef={audioRef} />
		</Layout.Content>
	)
}
