import React from 'react'

export interface MyComponentStyles {
	centerToParent: React.CSSProperties
	centerPicture: React.CSSProperties
}

export const AlignStyles: MyComponentStyles = {
	centerToParent: {
		display: 'flex',
		justifyContent: 'center',
	},
	centerPicture: {
		display: 'block',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
}
