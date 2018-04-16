module.exports = {
	"env": {
		"browser": true,
		"es6": true
	},
	"globals": {
		"google": true,
		"DBHelper": true,
	},
	"extends": "eslint:recommended",
	"rules": {
		"no-console": "off",
		"no-unused-vars": "warn",
		"linebreak-style": [
			"error",
			"windows"
		],
		"quotes": [
			"error",
			"backtick"
		],
		"semi": [
			"error",
			"always"
		]
	}
};