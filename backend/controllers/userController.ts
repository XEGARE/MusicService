import os from 'os'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

import db from '../db'

import { secret } from '../config.json'

const generateAccessToken = (id) => {
	const payload = {
		id,
	}
	return jwt.sign(payload, secret, { expiresIn: '30d' })
}

class UserController {
	async signup(req, res) {
		try {
			const { name, email, password } = req.body

			const candidate = await db.query(
				'SELECT * FROM users WHERE email = $1',
				[email]
			)

			if (candidate.rowCount) {
				throw new Error('Такой пользователь уже существует')
			}

			const hashPassword = await argon2.hash(password)

			const newUser = await db.query(
				'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
				[name, email, hashPassword]
			)

			if (newUser.rowCount) {
				const token = generateAccessToken(newUser.rows[0].id)

				res.status(200).json({
					message: 'Пользователь зарегистрирован',
					name: name,
					token: token,
				})
			} else {
				throw new Error('Неизвестная ошибка при регистрации')
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
			console.error(error)
		}
	}

	async signin(req, res) {
		try {
			const { email, password } = req.body

			const candidate = await db.query(
				'SELECT * FROM users WHERE email = $1',
				[email]
			)

			if (!candidate.rowCount) {
				throw new Error('Пользователь не найден')
			}

			if (await argon2.verify(candidate.rows[0].password, password)) {
				const token = generateAccessToken(candidate.rows[0].id)

				res.status(200).json({
					message: 'Успешная авторизация',
					userID: candidate.rows[0].id,
					name: candidate.rows[0].name,
					token: token,
				})
			} else {
				throw new Error('Некорректный логин или пароль')
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
			console.error(error)
		}
	}

	async token(req, res) {
		try {
			if (!req.headers.authorization) {
				throw new Error('Токен отсутствует')
			}

			const token = req.headers.authorization.split(' ')[1]

			if (token === 'null') {
				throw new Error('Токен не передан')
			}

			const decodeData = jwt.verify(token, secret)
			if (decodeData) {
				req.user = decodeData

				const candidate = await db.query(
					'SELECT * FROM users WHERE id = $1',
					[req.user.id]
				)

				if (!candidate.rowCount) {
					throw new Error('Пользователь не найден')
				}

				res.status(200).json({
					message: 'Успешная авторизация',
					name: candidate.rows[0].name,
				})
			} else {
				throw new Error('Пользователь не авторизован')
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
			console.error(error)
		}
	}

	async addFavorites(req, res) {
		try {
			if (!req.query.id) {
				throw new Error('ID альбома отсутствует')
			}

			if (!req.headers.authorization) {
				throw new Error('Токен отсутствует')
			}

			const token = req.headers.authorization.split(' ')[1]

			if (token === 'null') {
				throw new Error('Токен не передан')
			}

			const decodeData = jwt.verify(token, secret)
			if (decodeData) {
				req.user = decodeData

				const result = await db.query(
					'INSERT INTO favorites (user_id, album_id) VALUES ($1, $2)',
					[req.user.id, req.query.id]
				)

				if (result.rowCount) {
					res.status(200).json({
						message: `Альбом добавлен в избранное`,
					})
				} else {
					throw new Error('Ошибка добавления в избранное')
				}
			} else {
				throw new Error('Пользователь не авторизован')
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	}

	async getFavorites(req, res) {
		try {
			if (!req.headers.authorization) {
				throw new Error('Токен отсутствует')
			}

			const token = req.headers.authorization.split(' ')[1]

			if (token === 'null') {
				throw new Error('Токен не передан')
			}

			const decodeData = jwt.verify(token, secret)
			if (decodeData) {
				req.user = decodeData

				const result = await db.query(
					'SELECT album_id FROM favorites WHERE user_id = $1',
					[req.user.id]
				)

				if (result.rowCount) {
					res.status(200).json(result.rows)
				} else {
					res.status(200).json(null)
				}
			} else {
				throw new Error('Пользователь не авторизован')
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	}

	async deleteFavorites(req, res) {
		try {
			if (!req.query.id) {
				throw new Error('ID альбома отсутствует')
			}

			if (!req.headers.authorization) {
				throw new Error('Токен отсутствует')
			}

			const token = req.headers.authorization.split(' ')[1]

			if (token === 'null') {
				throw new Error('Токен не передан')
			}

			const decodeData = jwt.verify(token, secret)
			if (decodeData) {
				req.user = decodeData

				const result = await db.query(
					'DELETE FROM favorites WHERE album_id = $1 AND user_id = $2  RETURNING *',
					[req.query.id, req.user.id]
				)

				if (result.rowCount) {
					res.status(200).json({
						message: 'Удаление успешно',
						rows: result.rows,
					})
				} else {
					throw new Error('Ошибка удаления')
				}
			} else {
				throw new Error('Пользователь не авторизован')
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	}
}

export default new UserController()
