import * as fs from 'node:fs'
import jwt from 'jsonwebtoken'

import db from '../db'

import { secret } from '../config.json'

class FilesController {
	async uploadPicture(req, res) {
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

				const { path, mimetype } = req.file

				const newPicture = await db.query(
					'INSERT INTO pictures (type, file_path, user_id) VALUES ($1, $2, $3) RETURNING id',
					[mimetype, path, req.user.id]
				)

				if (newPicture.rowCount) {
					res.status(200).json({
						picture_id: newPicture.rows[0].id,
					})
				} else {
					throw new Error('Ошибка загрузки файла')
				}
			} else {
				throw new Error('Пользователь не авторизован')
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	}

	async deletePicture(req, res) {
		try {
			if (!req.query.id) {
				throw new Error('ID картинки отсутствует')
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
					'DELETE FROM pictures WHERE id = $1 AND user_id = $2 RETURNING *',
					[req.query.id, req.user.id]
				)

				if (result.rowCount) {
					const filePath = result.rows[0].file_path
					if (fs.existsSync(filePath)) {
						fs.unlink(filePath, (err) => {
							if (err) {
								throw new Error('Ошибка удаления')
							}

							res.status(200).json({
								message: 'Удаление успешно',
							})
						})
					} else {
						throw new Error('Файл отсутствует')
					}
				} else {
					throw new Error('Файл отсутствует')
				}
			} else {
				throw new Error('Пользователь не авторизован')
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	}

	async getPicture(req, res) {
		try {
			if (!req.query.id) {
				throw new Error('ID картинки отсутствует')
			}

			const result = await db.query(
				'SELECT * FROM pictures WHERE id = $1',
				[req.query.id]
			)

			if (result.rowCount) {
				const type = result.rows[0].type
				const filePath = result.rows[0].file_path

				if (fs.existsSync(filePath)) {
					res.setHeader('Content-Type', type)
					fs.createReadStream(filePath).pipe(res)
				} else {
					throw new Error('Файл отсутствует')
				}
			} else {
				throw new Error('Файл отсутствует')
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	}

	async uploadSong(req, res) {
		try {
			if (!req.query.album_id) {
				throw new Error('ID альбома отсутствует')
			}

			if (!req.headers.authorization) {
				throw new Error('Токен отсутствует')
			}

			const token = req.headers.authorization.split(' ')[1]

			if (token === 'null') {
				throw new Error('Токен не предан')
			}

			const decodeData = jwt.verify(token, secret)
			if (decodeData) {
				req.user = decodeData

				const { originalname, path, mimetype, size } = req.files[0]

				const fileName = Buffer.from(
					originalname.replace('.mp3', ''),
					'latin1'
				).toString('utf8')

				const newSong = await db.query(
					'INSERT INTO songs (name, type, file_path, file_size, album_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
					[fileName, mimetype, path, size, req.query.album_id]
				)

				if (newSong.rowCount) {
					res.status(200).json({
						song_id: newSong.rows[0].id,
					})
				} else {
					throw new Error('Ошибка загрузки файла')
				}
			} else {
				throw new Error('Пользователь не авторизован')
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	}

	async deleteSong(req, res) {
		try {
			if (!req.query.id) {
				throw new Error('ID песни отсутствует')
			}

			if (!req.query.album_id) {
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

				const checkAlbumResult = await db.query(
					'SELECT * FROM albums WHERE id = $1 AND user_id = $2',
					[req.query.album_id, req.user.id]
				)

				if (checkAlbumResult.rowCount) {
					const deletionResult = await db.query(
						'DELETE FROM songs WHERE id = $1 AND album_id = $2 RETURNING *',
						[req.query.id, req.query.album_id]
					)

					if (deletionResult.rowCount) {
						const filePath = deletionResult.rows[0].file_path
						if (fs.existsSync(filePath)) {
							fs.unlink(filePath, (err) => {
								if (err) {
									throw new Error('Ошибка удаления')
								}

								res.status(200).json({
									message: 'Удаление успешно',
								})
							})
						} else {
							throw new Error('Файл отсутствует')
						}
					} else {
						throw new Error('Файл отсутствует')
					}
				} else {
					throw new Error('Альбом не принадлежит пользователю')
				}
			} else {
				throw new Error('Пользователь не авторизован')
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	}

	async getSong(req, res) {
		try {
			if (!req.query.id) {
				throw new Error('ID песни отсутствует')
			}

			const result = await db.query('SELECT * FROM songs WHERE id = $1', [
				req.query.id,
			])

			if (result.rowCount) {
				const type = result.rows[0].type
				const filePath = result.rows[0].file_path
				const fileSize = result.rows[0].file_size

				if (fs.existsSync(filePath)) {
					const range = req.headers.range

					if (range) {
						const parts = range.replace(/bytes=/, '').split('-')
						const start = parseInt(parts[0], 10)
						const end = parts[1]
							? parseInt(parts[1], 10)
							: fileSize - 1
						const chunkSize = end - start + 1
						const file = fs.createReadStream(filePath, {
							start,
							end,
						})
						const headers = {
							'Content-Range': `bytes ${start}-${end}/${fileSize}`,
							'Accept-Ranges': 'bytes',
							'Content-Length': chunkSize,
							'Content-Type': type,
						}

						res.writeHead(206, headers)
						file.pipe(res)
					} else {
						const headers = {
							'Content-Length': fileSize,
							'Content-Type': type,
						}

						res.writeHead(200, headers)
						fs.createReadStream(filePath).pipe(res)
					}
				} else {
					throw new Error('Файл отсутствует')
				}
			} else {
				throw new Error('Файл отсутствует')
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	}
}

export default new FilesController()
