import { useState, useEffect } from 'react'
import { Button, Dropdown, Space, Tooltip, Spin } from 'antd'
import type { MenuProps } from 'antd'

import { UserOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons'

import AuthorizationModal from './modals/Authorization'
import CreateAlbumModal from './modals/albums/CreateAlbum'

const items: MenuProps['items'] = [
	{
		key: '1',
		label: 'Мои альбомы',
	},
	{
		key: '2',
		label: 'Избранные альбомы',
	},
	{
		key: '3',
		danger: true,
		label: 'Выйти',
	},
]

interface ComponentProps {
	handleShowUserAlbums: any
	handleShowUserFavoriteAlbums: any
	handleUseSearch: any
}

export default function User(props: ComponentProps) {
	const [openAuthorizationState, setOpenAuthorizationState] = useState(false)
	const [createAlbumState, setCreateAlbumState] = useState(false)

	const [isUserAuthorized, setUserAuthorized] = useState(0)

	useEffect(() => {
		if (!isUserAuthorized) {
			const token = localStorage.getItem('token')
			if (token) {
				fetch('/user/token', {
					method: 'get',
					headers: { Authorization: `Bearer ${token}` },
				}).then((res) => {
					res.json()
						.then((data) => {
							if (res.ok) {
								localStorage.setItem('userName', data.name)
								setUserAuthorized(2)
							} else {
								throw new Error(data.message)
							}
						})
						.catch((error) => {
							console.error(error)
							setUserAuthorized(1)
						})
				})
			} else setUserAuthorized(1)
		}
	}, [isUserAuthorized])

	const handleMenuClick: MenuProps['onClick'] = (e) => {
		if (e.key === '1') {
			props.handleShowUserAlbums(true)
			props.handleShowUserFavoriteAlbums(false)
			props.handleUseSearch(false)
		} else if (e.key === '2') {
			props.handleShowUserFavoriteAlbums(true)
			props.handleShowUserAlbums(false)
			props.handleUseSearch(false)
		} else if (e.key === '3') {
			props.handleShowUserAlbums(false)
			props.handleShowUserFavoriteAlbums(false)
			props.handleUseSearch(false)
			localStorage.removeItem('userName')
			localStorage.removeItem('token')
			localStorage.removeItem('userFavorites')
			setUserAuthorized(1)
		}
	}

	const menuProps = {
		items,
		onClick: handleMenuClick,
	}

	return (
		<>
			{isUserAuthorized === 0 && <Spin />}

			{isUserAuthorized === 1 && (
				<Button
					type='primary'
					onClick={() => {
						setOpenAuthorizationState(true)
					}}
				>
					Войти
				</Button>
			)}

			{isUserAuthorized === 2 && (
				<Space>
					<Tooltip title='Создать альбом'>
						<Button
							shape='circle'
							icon={<PlusOutlined />}
							onClick={() => {
								setCreateAlbumState(true)
							}}
						/>
					</Tooltip>

					<Dropdown menu={menuProps}>
						<Button>
							<Space>
								<UserOutlined />
								{localStorage.getItem('userName')}
								<DownOutlined />
							</Space>
						</Button>
					</Dropdown>
				</Space>
			)}

			{openAuthorizationState && (
				<AuthorizationModal
					isOpen={openAuthorizationState}
					handleOpen={setOpenAuthorizationState}
					handleUser={setUserAuthorized}
				/>
			)}

			{createAlbumState && (
				<CreateAlbumModal
					isOpen={createAlbumState}
					handleOpen={setCreateAlbumState}
				/>
			)}
		</>
	)
}
