import { Space, Spin } from 'antd'
import { TextStyles } from '../../styles/Text.Styles'
import { AlignStyles } from '../../styles/Alignment.Styles'

interface ComponentProps {
	message: string
	picture: string
	width: string
}

export default function LoadingDataEvent(props: ComponentProps) {
	return (
		<Space direction='vertical' style={{ width: '100%' }}>
			<h1 style={TextStyles.infoText}>{props.message}</h1>
			<Spin style={AlignStyles.centerToParent} size='large' />
			<img
				src={props.picture}
				style={{
					...AlignStyles.centerPicture,
					width: `${props.width}`,
				}}
			/>
		</Space>
	)
}
