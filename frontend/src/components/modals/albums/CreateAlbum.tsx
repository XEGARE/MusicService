import { useState } from 'react'
import { Modal, Upload, Form, Input } from 'antd'
import { Store } from 'antd/lib/form/interface'
import type { UploadFile, UploadProps } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/es/upload'
import Validator from '../../utils/validators'
import { useQueryClient } from '@tanstack/react-query'
import TextArea from 'antd/es/input/TextArea'
import Message from '../../utils/messages'
import { TextStyles } from '../../../styles/Text.Styles'
import { AlignStyles } from '../../../styles/Alignment.Styles'

interface ComponentProps {
	isOpen: boolean
	handleOpen: any
}

interface ImageSize {
	width: number
	height: number
}

const uploadButton = (
	<button style={{ border: 0, background: 'none' }} type='button'>
		<PlusOutlined />
		<div style={{ marginTop: 8 }}>Загрузить обложку</div>
	</button>
)

const checkImageDimensions = async (file: RcFile): Promise<ImageSize> => {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.src = URL.createObjectURL(file)
		img.onload = () => resolve({ width: img.width, height: img.height })
		img.onerror = (error) => reject(error)
	})
}

export default function CreateAlbum(props: ComponentProps) {
	const queryClient = useQueryClient()

	const [form] = Form.useForm()
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const [isFileFormatCorrect, setFileFormatCorrect] = useState(false)
	const [isFileSizeCorrect, setFileSizeCorrect] = useState(false)
	const [isImageFileCorrect, setImageSizeCorrect] = useState(false)

	const propsPicture: UploadProps = {
		name: 'picture',
		listType: 'picture-circle',
		action: '/files/upload/picture',
		multiple: false,
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
		accept: 'image/jpeg, image/png',
		fileList: fileList,
		showUploadList: {
			showPreviewIcon: false,
		},
		onChange({ fileList }) {
			setFileList(fileList)
		},
		async beforeUpload(file) {
			const isJpgOrPng =
				file.type === 'image/jpeg' || file.type === 'image/png'
			setFileFormatCorrect(isJpgOrPng)
			if (!isJpgOrPng) {
				Message.error('Допустима загрузка только JPG/PNG файлов!')
			}
			const isLt2M = file.size / 1024 / 1024 < 2
			setFileSizeCorrect(isLt2M)
			if (!isLt2M) {
				Message.error('Изображение должно быть меньше 2 МБ!')
			}

			var imgWidth = 0
			var imgHeight = 0
			await checkImageDimensions(file).then((result) => {
				imgWidth = result.width
				imgHeight = result.height
			})

			const isImageSize = imgWidth == imgHeight && imgWidth >= 200
			setImageSizeCorrect(isImageSize)
			if (!isImageSize) {
				Message.error(
					'Изображение должно быть размером не меньше 200x200 пикселей!'
				)
			}
			return isJpgOrPng && isLt2M
		},
		onRemove(file) {
			const token = localStorage.getItem('token')
			if (token) {
				fetch(`/files/delete/picture/?id=${file.response.picture_id}`, {
					method: 'delete',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}).then((res) => {
					res.json()
						.then((data) => {
							if (res.ok) {
								form.resetFields(['cover'])
							} else {
								throw new Error(data.message)
							}
						})
						.catch((error) => {
							console.error('Ошибка удаления:', error)
						})
				})
			}

			return true
		},
	}

	const handleFormConfirm = (values: Store) => {
		if (!isFileFormatCorrect) {
			return Message.error('Допустима загрузка только JPG/PNG файлов!')
		}
		if (!isFileSizeCorrect) {
			return Message.error('Изображение должно быть меньше 2 МБ!')
		}
		if (!isImageFileCorrect) {
			return Message.error(
				'Изображение должно быть размером не меньше 200x200 пикселей!'
			)
		}

		const token = localStorage.getItem('token')
		if (token) {
			fetch(`/albums/create`, {
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
							setFileList([])
							form.resetFields()
							props.handleOpen(false)
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
						Message.error(error.message)
					})
			})
		}
	}

	const handleCancel = () => {
		props.handleOpen(false)
	}

	return (
		<>
			<Modal
				title='Создание альбома'
				centered
				open={props.isOpen}
				closeIcon={null}
				okText='Создать'
				onOk={form.submit}
				cancelText='Отмена'
				onCancel={handleCancel}
			>
				<Form
					form={form}
					name='create-album-form'
					initialValues={{ remember: true }}
					onFinish={handleFormConfirm}
					labelCol={{ span: 5 }}
				>
					<Form.Item name='cover' style={AlignStyles.centerToParent}>
						<Upload {...propsPicture}>
							{fileList.length >= 1 ? null : uploadButton}
						</Upload>
					</Form.Item>

					<Form.Item
						label='Название'
						name='title'
						rules={[
							{ required: true, message: 'Введите название' },
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label='Описание'
						name='description'
						rules={[
							{ required: true, message: 'Введите описание' },
							{
								validator: (_, value) =>
									Validator.validateInputLength(value),
							},
						]}
					>
						<TextArea rows={4} maxLength={500} />
					</Form.Item>
				</Form>

				<h3 style={TextStyles.infoText}>
					Добавление песен возможно в "Мои альбомы"
				</h3>
			</Modal>
		</>
	)
}
