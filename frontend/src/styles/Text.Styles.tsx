import React from 'react'

export interface MyComponentStyles {
	infoText: React.CSSProperties
	errorText: React.CSSProperties
	cardTitleText: React.CSSProperties
	cardDescriptionText: React.CSSProperties
}

export const TextStyles: MyComponentStyles = {
	infoText: {
		textAlign: 'center',
		boxAlign: 'center',
	},
	errorText: {
		textAlign: 'center',
		boxAlign: 'center',
		color: 'red',
	},
	cardTitleText: {
		fontSize: '16px',
		color: 'rgba(0, 0, 0, 0.88)',
		fontWeight: 600,
		marginBottom: '8px',
	},
	cardDescriptionText: {
		fontSize: '14px',
		color: 'rgba(0, 0, 0, 0.45)',
		lineHeight: 1.5714285714285714,
	},
}
