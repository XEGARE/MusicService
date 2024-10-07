import { Card, Space } from 'antd'
import { AlbumStruct } from '../../interfaces/Album.Interface'
import { TextStyles } from '../../styles/Text.Styles'

interface ComponentProps {
	albumList: AlbumStruct[]
	handleCardClick: any
}

export default function ShowAlbums(props: ComponentProps) {
	return (
		<Space
			size='middle'
			wrap
			style={{
				display: 'flex',
				justifyContent: 'space-evenly',
				alignItems: 'start',
				flexWrap: 'wrap',
			}}
		>
			{props.albumList.map((album) => (
				<Card
					key={album.id}
					style={{ width: 220 }}
					cover={
						<img
							alt={'cover'}
							src={`/files/picture/?id=${album.picture_id}`}
						/>
					}
					hoverable
					onClick={() => props.handleCardClick(album)}
				>
					<div style={TextStyles.cardTitleText}>{album.title}</div>
					<div style={TextStyles.cardDescriptionText}>
						{album.description}
					</div>
				</Card>
			))}
		</Space>
	)
}
