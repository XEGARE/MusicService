import { Form, Input, FormInstance } from 'antd'
import Validator from '../utils/validators'
import { KeyOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'

interface ComponentProps {
	form: FormInstance
	handleFormConfirm: any
}

const Registration = (props: ComponentProps) => {
	return (
		<Form
			form={props.form}
			name='registration-form'
			initialValues={{ remember: true }}
			onFinish={props.handleFormConfirm}
			labelCol={{ span: 5 }}
		>
			<Form.Item
				label='Имя'
				name='name'
				rules={[
					{ required: true, message: 'Введите своё имя' },
					{
						validator: (_, value) =>
							Validator.validateInputLength(value),
					},
				]}
			>
				<Input
					onPressEnter={props.form.submit}
					prefix={<UserOutlined />}
				/>
			</Form.Item>

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
				rules={[{ required: true, message: 'Придумайте пароль' }]}
			>
				<Input.Password
					onPressEnter={props.form.submit}
					prefix={<KeyOutlined />}
				/>
			</Form.Item>
		</Form>
	)
}

export default Registration
