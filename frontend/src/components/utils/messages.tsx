import { notification } from 'antd'

class Message {
	static success(message: string) {
		notification.success({
			message: 'Успех',
			description: message,
			placement: 'bottom',
		})
	}

	static error(message: string) {
		notification.error({
			message: 'Ошибка',
			description: message,
			placement: 'bottom',
		})
	}
}

export default Message
