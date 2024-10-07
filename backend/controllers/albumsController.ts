import * as fs from 'node:fs'
import jwt from 'jsonwebtoken'

import db from '../db'

import { secret } from '../config.json'

class AlbumsController {
	async createAlbum(req, res) {
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

				const data = req.body

				const coverID = data.cover.file.response.picture_id
				const title = data.title
				const description = data.description

				const result = await db.query(
					'INSERT INTO albums (title, description, user_id, picture_id) VALUES ($1, $2, $3, $4) RETURNING id',
					[title, description, req.user.id, coverID]
				)

				if (result.rowCount) {
					res.status(200).json({
						message: `Альбом "${title}" создан`,
					})
				} else {
					throw new Error('Ошибка создания альбома')
				}
			} else {
				throw new Error('Пользователь не авторизован')
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	}

	async updateAlbum(req, res) {
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

				const data = req.body

				const title = data.title
				const description = data.description

				const result = await db.query(
					'UPDATE albums SET title = $1, description = $2 WHERE id = $3 AND user_id = $4',
					[title, description, req.query.id, req.user.id]
				)

				if (result.rowCount) {
					res.status(200).json({
						message: `Альбом "${title}" сохранён`,
					})
				} else {
					throw new Error('Ошибка сохранения альбома')
				}
			} else {
				throw new Error('Пользователь не авторизован')
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	}

	async deleteAlbum(req, res) {
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
					'DELETE FROM albums WHERE id = $1 AND user_id = $2 RETURNING *',
					[req.query.id, req.user.id]
				)

				if (result.rowCount) {
					res.status(200).json({
						message: `Альбом ${result.rows[0].title} удалён`,
					})
				} else {
					throw new Error('Альбом отсутствует')
				}
			} else {
				throw new Error('Пользователь не авторизован')
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	}

	async getAlbumData(req, res) {
		try {
			if (!req.query.id) {
				throw new Error('ID альбома отсутствует')
			}

			const result = await db.query(
				`SELECT json_build_object( 'id', a.id, 'title', a.title, 'description', a.description, 'user_id', a.user_id, 'picture_id', a.picture_id, 'songs', json_agg(json_build_object( 'id', s.id, 'name', s.name, 'type', s.type, 'file_path', s.file_path, 'file_size', s.file_size, 'album_id', s.album_id )) ) AS data FROM albums a LEFT JOIN songs s ON a.id = s.album_id WHERE a.id = $1 GROUP BY a.id`,
				[req.query.id]
			)

			if (result.rowCount) {
				res.status(200).json(result.rows[0]['data'])
			} else {
				throw new Error('Данные альбома не найдены')
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	}

	async getAllAlbums(req, res) {
		try {
			const result = await db.query(
				'SELECT * FROM albums ORDER BY id DESC'
			)

			if (result.rowCount) {
				res.status(200).json(result.rows)
			} else {
				res.status(200).json(null)
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	}

	async getUserAlbums(req, res) {
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
					'SELECT * FROM albums WHERE user_id = $1',
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

	async getUserFavoriteAlbums(req, res) {
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
					'SELECT a.* FROM albums a LEFT JOIN favorites f ON a.id = f.album_id WHERE f.user_id = $1',
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

	async searchAlbums(req, res) {
		try {
			if (!req.query.query) {
				throw new Error('Запрос на поиск отсутствует')
			}
			var query = req.query.query.replaceAll(' ', ' | ')

			const result = await db.query(
				'SELECT a.* FROM albums a LEFT JOIN songs s ON a.id = s.album_id WHERE to_tsvector(a.title) @@ to_tsquery($1) OR to_tsvector(a.description) @@ to_tsquery($1) OR to_tsvector(s.name) @@ to_tsquery($1) GROUP BY a.id',
				[query]
			)

			if (result.rowCount) {
				res.status(200).json(result.rows)
			} else {
				res.status(200).json(null)
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	}
}

export default new AlbumsController()
