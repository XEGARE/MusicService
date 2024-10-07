import { MailOutlined, KeyOutlined } from '@ant-design/icons'
import { Form, Input, FormInstance } from 'antd'

interface ComponentProps {
	form: FormInstance
	handleFormConfirm: any
}

const Authorization = (props: ComponentProps) => {
	return (
		<Form
			form={props.form}
			name='authorization-form'
			initialValues={{ remember: true }}
			onFinish={props.handleFormConfirm}
			labelCol={{ span: 5 }}
		>
			<Form.Item
				label='Почта'
				name='email'
				rules={[
					{ required: true, message: 'Введите свою почту' },
					{
						type: 'email',
						message:
							'Введите ваш адрес почты в формате yourname@example.com',
					},
				]}
			>
				<Input
					onPressEnter={props.form.submit}
					prefix={<MailOutlined />}
				/>
			</Form.Item>

			<Form.Item
				label='Пароль'
				name='password'
				rules={[{ required: true, message: 'Введите свой пароль' }]}
			>
				<Input.Password
					onPressEnter={props.form.submit}
					prefix={<KeyOutlined />}
				/>
			</Form.Item>
		</Form>
	)
}

export default Authorization
