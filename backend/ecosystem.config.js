module.exports = {
	apps: [
		{
			name: 'Music Service',
			script: './server.ts',
			ignore_watch: ['node_modules'],
			watch: true,
			watch_options: {
				followSymlinks: false,
			},
		},
	],
}
