import { useState } from 'react'
import { Modal, Form, Button, Space } from 'antd'
import { Store } from 'antd/lib/form/interface'

import AuthorizationForm from '../forms/Authorization'
import RegistrationForm from '../forms/Registration'
import Message from '../utils/messages'
import { TextStyles } from '../../styles/Text.Styles'
import UserAgreement from './UserAgreement'
import Link from 'antd/es/typography/Link'

interface ComponentProps {
	isOpen: boolean
	handleOpen: any
	handleUser: any
}

export default function Authorization(props: ComponentProps) {
	const [form] = Form.useForm()

	const [registrationState, setRegistrationState] = useState(false)
	const [showUserAgreementState, setShowUserAgreementState] = useState(false)

	function sendRequest(url: string, values: Store) {
		fetch(url, {
			method: 'post',
			body: JSON.stringify(values),
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((res) => {
			res.json()
				.then((data) => {
					if (res.ok) {
						Message.success(data.message)
						localStorage.setItem('userName', data.name)
						localStorage.setItem('token', data.token)
						props.handleUser(2)
						form.resetFields()
						props.handleOpen(false)
					} else {
						throw new Error(data.message)
					}
				})
				.catch((error) => {
					Message.error(error.message)
				})
		})
	}

	const handleSignUp = (values: Store) => {
		sendRequest('/user/signup', values)
	}

	const handleSignIn = (values: Store) => {
		sendRequest('/user/signin', values)
	}

	const handleCancel = () => {
		form.resetFields()
		props.handleOpen(false)
	}

	return (
		<>
			<Modal
				title={registrationState ? 'Регистрация' : 'Авторизация'}
				centered
				open={props.isOpen}
				closeIcon={null}
				okText={registrationState ? 'Зарегистрироваться' : 'Войти'}
				onOk={form.submit}
				cancelText='Отмена'
				onCancel={handleCancel}
				footer={(_, { OkBtn, CancelBtn }) => (
					<>
						<Button
							type='link'
							onClick={() => {
								setRegistrationState(!registrationState)
							}}
						>
							{registrationState ? 'Авторизация' : 'Регистрация'}
						</Button>
						<CancelBtn />
						<OkBtn />
					</>
				)}
			>
				{registrationState ? (
					<Space direction='vertical' style={{ width: '100%' }}>
						<p style={TextStyles.infoText}>
							Для регистрации аккаунта введите данные указанные
							ниже
						</p>
						<RegistrationForm
							form={form}
							handleFormConfirm={handleSignUp}
						/>
						<p
							style={{
								...TextStyles.infoText,
								fontSize: 'small',
							}}
						>
							Нажимая «Зарегистрироваться», вы принимаете{' '}
							<Link
								onClick={() => {
									setShowUserAgreementState(true)
								}}
							>
								пользовательское соглашение
							</Link>
						</p>
						{showUserAgreementState && (
							<UserAgreement
								isOpen={showUserAgreementState}
								handleOpen={setShowUserAgreementState}
							/>
						)}
					</Space>
				) : (
					<Space direction='vertical' style={{ width: '100%' }}>
						<p style={TextStyles.infoText}>
							Для авторизации введите данные указанные ниже
						</p>
						<AuthorizationForm
							form={form}
							handleFormConfirm={handleSignIn}
						/>
					</Space>
				)}
			</Modal>
		</>
	)
}
