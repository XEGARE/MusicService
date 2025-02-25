class Function {
	static declination(
		number: number,
		txt: string[],
		cases = [2, 0, 1, 1, 1, 2]
	): string {
		return txt[
			number % 100 > 4 && number % 100 < 20
				? 2
				: cases[number % 10 < 5 ? number % 10 : 5]
		]
	}
}

export default Function
