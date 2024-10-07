class Validator {
	static validateInputLength(value: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (value && value.length > 255) {
				reject(new Error('Длина не должна превышать 255 символов'))
			} else {
				resolve()
			}
		})
	}
}

export default Validator
