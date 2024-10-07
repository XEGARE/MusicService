import { Layout, Row, Col } from 'antd'

import AppHeader from './components/layout/AppHeader'
import AppContent from './components/layout/AppContent'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import userService from './services/User.Service'

const layoutStyle = {
	height: '100%',
	backgroundColor: '#f6f5f3',
}

export default function App() {
	const [isShowUserAlbums, setShowUserAlbums] = useState(false)
	const [isShowUserFavoriteAlbums, setShowUserFavoriteAlbums] =
		useState(false)
	const [isUseSearch, setUseSearch] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')

	const { isSuccess, data } = useQuery({
		queryKey: ['userFavoritesData'],
		queryFn: () => userService.getFavorites(localStorage.getItem('token')),
	})

	if (isSuccess) {
		if (data) {
			localStorage.setItem('userFavorites', JSON.stringify(data))
		} else {
			localStorage.removeItem('userFavorites')
		}
	}

	return (
		<Layout style={layoutStyle}>
			<Row>
				<Col
					xs={{ span: 24, offset: 0 }}
					sm={{ span: 22, offset: 1 }}
					md={{ span: 18, offset: 3 }}
					lg={{ span: 16, offset: 4 }}
					xl={{ span: 14, offset: 5 }}
					xxl={{ span: 12, offset: 6 }}
				>
					<AppHeader
						handleShowUserAlbums={setShowUserAlbums}
						handleShowUserFavoriteAlbums={setShowUserFavoriteAlbums}
						handleUseSearch={setUseSearch}
						handleSearchQuery={setSearchQuery}
					/>
				</Col>
			</Row>
			<Row>
				<Col
					xs={{ span: 24, offset: 0 }}
					sm={{ span: 22, offset: 1 }}
					md={{ span: 18, offset: 3 }}
					lg={{ span: 16, offset: 4 }}
					xl={{ span: 14, offset: 5 }}
					xxl={{ span: 12, offset: 6 }}
				>
					<AppContent
						isShowUserAlbums={isShowUserAlbums}
						isShowUserFavoriteAlbums={isShowUserFavoriteAlbums}
						isUseSearch={isUseSearch}
						searchQuery={searchQuery}
					/>
				</Col>
			</Row>
		</Layout>
	)
}
