import { Space } from 'antd'
import { TextStyles } from '../../styles/Text.Styles'
import { AlignStyles } from '../../styles/Alignment.Styles'

interface ComponentProps {
	title: string
	message: string
	picture: string
	width: string
}

export default function NotFoundDataEvent(props: ComponentProps) {
	return (
		<Space direction='vertical' style={{ width: '100%' }}>
			<h1 style={TextStyles.infoText}>{props.title}</h1>
			<p style={TextStyles.infoText}>{props.message}</p>
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
