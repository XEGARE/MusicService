import { Input, Image, AutoComplete } from 'antd'
import type { SearchProps } from 'antd/es/input/Search'

import logo from '../../../public/images/logo.svg'

import User from '../User'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'antd/es/typography/Link'
import { useEffect, useState } from 'react'

const headerStyle: React.CSSProperties = {
	backgroundColor: '#fff',
	marginBottom: '2px',
	paddingLeft: '20px',
	paddingRight: '20px',
}

interface ComponentProps {
	handleShowUserAlbums: any
	handleShowUserFavoriteAlbums: any
	handleUseSearch: any
	handleSearchQuery: any
}

const renderItem = (title: string) => ({
	value: title,
	label: <div>{title}</div>,
})

export default function AppHeader(props: ComponentProps) {
	const queryClient = useQueryClient()

	const [searchHistory, setSearchHistory] = useState<string[]>([])
	const [searchOptions, setSearchOptions] = useState<any[]>([])

	const renderTitle = (title: string) => (
		<span>
			{title}
			<Link
				style={{ float: 'right', fontSize: 'small' }}
				onClick={() => {
					localStorage.removeItem('searchHistory')
					setSearchHistory([])
					setSearchOptions([])
				}}
			>
				очистить
			</Link>
		</span>
	)

	const createHistoryOptions = (list: string[]) => {
		const reverseList = [...list].reverse()
		if (reverseList.length) {
			var options: any[] = []

			reverseList.map((item) => {
				options.push(renderItem(item))
			})

			setSearchOptions([
				{
					label: renderTitle('История поиска'),
					options: options,
				},
			])
		} else {
			setSearchOptions([])
		}
	}

	const onSearch: SearchProps['onSearch'] = (value, _e) => {
		if (value) {
			if (searchHistory.includes(value)) {
				const index = searchHistory.indexOf(value, 0)
				if (index > -1) {
					searchHistory.splice(index, 1)
				}
			} else {
				const length = searchHistory.length
				if (length >= 5) {
					searchHistory.splice(0, length - 4)
				}
			}
			searchHistory.push(value)
			setSearchHistory(searchHistory)
			localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
			createHistoryOptions(searchHistory)
			props.handleSearchQuery(value)
			props.handleUseSearch(true)
			queryClient.removeQueries({
				queryKey: ['searchAlbumsData'],
				exact: true,
			})
			queryClient.invalidateQueries({
				queryKey: ['searchAlbumsData'],
			})
		}
	}

	const handleLogoClick = () => {
		props.handleShowUserAlbums(false)
		props.handleShowUserFavoriteAlbums(false)
		props.handleUseSearch(false)
	}

	useEffect(() => {
		const storedSearchHistoryData: string[] = JSON.parse(
			localStorage.getItem('searchHistory') as string
		)
		if (storedSearchHistoryData) {
			setSearchHistory(storedSearchHistoryData)
			createHistoryOptions(storedSearchHistoryData)
		}
	}, [])

	return (
		<div
			style={{
				...headerStyle,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexWrap: 'wrap',
				gap: '20px',
			}}
		>
			<Image
				src={logo}
				preview={false}
				alt='Wave Logo'
				onClick={handleLogoClick}
				style={{
					height: 50,
					padding: '5px 0px 5px 0px',
					cursor: 'pointer',
				}}
			/>

			<AutoComplete
				popupClassName='certain-category-search-dropdown'
				popupMatchSelectWidth={350}
				options={searchOptions}
				style={{ flex: 'auto' }}
			>
				<Input.Search
					placeholder='Трек, исполнитель, альбом'
					onSearch={onSearch}
					allowClear
					required={true}
				/>
			</AutoComplete>

			<User
				handleShowUserAlbums={props.handleShowUserAlbums}
				handleShowUserFavoriteAlbums={
					props.handleShowUserFavoriteAlbums
				}
				handleUseSearch={props.handleUseSearch}
			/>
		</div>
	)
}
