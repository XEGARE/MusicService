import { Modal, Upload, Form, Input, Button, Space, Popconfirm } from 'antd'
import { Store } from 'antd/lib/form/interface'
import type { UploadProps } from 'antd'
import {
	DeleteOutlined,
	QuestionCircleOutlined,
	UploadOutlined,
} from '@ant-design/icons'
import Validator from '../../utils/validators'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import AlbumService from '../../../services/Album.Service'
import Message from '../../utils/messages'
import TextArea from 'antd/es/input/TextArea'
import { TextStyles } from '../../../styles/Text.Styles'
import LoadingDataEvent from '../../events/LoadingData'
import ErrorDataEvent from '../../events/ErrorData'
import NotFoundDataEvent from '../../events/NotFoundData'

interface ComponentProps {
	isOpen: boolean
	handleOpen: any
	albumData: any
}

export default function EditAlbum(props: ComponentProps) {
	const queryClient = useQueryClient()

	const { isLoading, isSuccess, isError, data } = useQuery({
		queryKey: ['albumData'],
		queryFn: () => AlbumService.getByID(props.albumData.id),
	})

	const [form] = Form.useForm()

	const propsSong: UploadProps = {
		name: 'song',
		multiple: true,
		listType: 'text',
		action: `/files/upload/song/?album_id=${props.albumData.id}`,
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
		accept: 'audio/mpeg',
		showUploadList: {
			showRemoveIcon: false,
		},
		onChange({ fileList }) {
			var isDone = false
			fileList.map((file) => {
				if (file.status == 'done') {
					isDone = true
				}
			})
			if (isDone) {
				queryClient.invalidateQueries({
					queryKey: ['albumData'],
				})
			}
		},
		async beforeUpload(file) {
			const isMpeg = file.type === 'audio/mpeg'
			if (!isMpeg) {
				Message.error('Допустима загрузка только MP3 файлов!')
			}
			return isMpeg
		},
	}

	const handleFormConfirm = (values: Store) => {
		if (isSuccess) {
			if (
				data.title != values.title ||
				data.description != values.description
			) {
				const token = localStorage.getItem('token')
				if (token) {
					fetch(`/albums/update/?id=${props.albumData.id}`, {
						method: 'post',
						body: JSON.stringify(values),
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
					}).then((res) => {
						res.json()
							.then((data) => {
								if (res.ok) {
									Message.success(data.message)
									queryClient.invalidateQueries({
										queryKey: ['allAlbumsData'],
									})
									queryClient.invalidateQueries({
										queryKey: ['userAlbumsData'],
									})
									handleCancel()
								} else {
									throw new Error(data.message)
								}
							})
							.catch((error) => {
								Message.error(error.message)
							})
					})
				}
			} else {
				handleCancel()
			}
		} else {
			handleCancel()
		}
	}

	const handleCancel = () => {
		queryClient.removeQueries({ queryKey: ['albumData'], exact: true })
		form.resetFields()
		props.handleOpen(false)
	}

	const handleRemoveSong = (id: number) => {
		const token = localStorage.getItem('token')
		if (token) {
			fetch(
				`/files/delete/song/?id=${id}&album_id=${props.albumData.id}`,
				{
					method: 'delete',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			).then((res) => {
				res.json()
					.then((data) => {
						if (res.ok) {
							queryClient.invalidateQueries({
								queryKey: ['albumData'],
							})
						} else {
							throw new Error(data.message)
						}
					})
					.catch((error) => {
						console.error('Ошибка удаления:', error)
					})
			})
		}
	}

	const handleDeleteAlbumConfirm = () => {
		if (data) {
			fetch(`/albums/delete/?id=${data.id}`, {
				method: 'delete',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}).then((res) => {
				res.json()
					.then((data) => {
						if (res.ok) {
							Message.success(data.message)
							handleCancel()
							queryClient.invalidateQueries({
								queryKey: ['allAlbumsData'],
							})
							queryClient.invalidateQueries({
								queryKey: ['userAlbumsData'],
							})
						} else {
							throw new Error(data.message)
						}
					})
					.catch((error) => {
						console.error(error)
					})
			})
		}
	}

	if (isSuccess && data) {
		if (form.getFieldValue('title') != data.title)
			form.setFieldValue('title', data.title)
		if (form.getFieldValue('description') != data.description)
			form.setFieldValue('description', data.description)

		data.songs.reverse()
	}

	return (
		<Modal
			title='Редактирование альбома'
			centered
			open={props.isOpen}
			closeIcon={null}
			okText='Сохранить'
			onOk={form.submit}
			cancelText='Отмена'
			onCancel={handleCancel}
			footer={(_, { OkBtn, CancelBtn }) => (
				<>
					{isSuccess && data && (
						<Popconfirm
							title='Удаление альбома'
							description='Вы уверены что хотите удалить этот альбом?'
							onConfirm={handleDeleteAlbumConfirm}
							okText='Да'
							cancelText='Нет'
							icon={
								<QuestionCircleOutlined
									style={{ color: 'red' }}
								/>
							}
						>
							<Button danger>Удалить</Button>
						</Popconfirm>
					)}

					<CancelBtn />
					<OkBtn />
				</>
			)}
		>
			{isLoading && (
				<LoadingDataEvent
					message='Данные альбома загружаются'
					picture='images/getting.svg'
					width='50%'
				/>
			)}

			{isError && (
				<ErrorDataEvent
					title='К сожалению произошла ошибка'
					message='Повторите попытку позже'
					picture='images/error.svg'
					width='50%'
				/>
			)}

			{isSuccess && !data && (
				<NotFoundDataEvent
					title='Данные альбома не найдены'
					message='Повторите попытку позже'
					picture='images/not-found-data.svg'
					width='50%'
				/>
			)}

			{isSuccess && data && (
				<>
					<Form
						form={form}
						name='edit-album-form'
						initialValues={{ remember: true }}
						onFinish={handleFormConfirm}
						labelCol={{ span: 5 }}
					>
						<Form.Item
							label='Заголовок'
							name='title'
							rules={[
								{
									required: true,
									message: 'Введите название',
								},
							]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							label='Описание'
							name='description'
							rules={[
								{
									required: true,
									message: 'Введите описание',
								},
								{
									validator: (_, value) =>
										Validator.validateInputLength(value),
								},
							]}
						>
							<TextArea rows={4} maxLength={500} />
						</Form.Item>

						<Form.Item valuePropName='uploadButton'>
							<Upload {...propsSong}>
								<Button icon={<UploadOutlined />}>
									Загрузить
								</Button>
							</Upload>
						</Form.Item>

						<Form.Item>
							{data.songs[0].id ? (
								<>
									<h3 style={TextStyles.infoText}>
										Содержимое (удаление нельзя отменить)
									</h3>
									<Space
										direction='vertical'
										style={{
											display: 'flex',
										}}
									>
										{data.songs.map((song, index) => (
											<Space.Compact block key={index}>
												<Input
													value={song.name}
													disabled={true}
													style={{
														color: 'black',
														background: 'none',
														cursor: 'default',
													}}
												/>
												<Button
													icon={<DeleteOutlined />}
													onClick={() => {
														handleRemoveSong(
															song.id
														)
													}}
												/>
											</Space.Compact>
										))}
									</Space>
								</>
							) : (
								<NotFoundDataEvent
									title='Музыка отсутствуют'
									message='Загрузите музыку'
									picture='images/not-found-data.svg'
									width='50%'
								/>
							)}
						</Form.Item>
					</Form>
				</>
			)}
		</Modal>
	)
}
