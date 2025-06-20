module.exports = function (api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			[
				"module-resolver",
				{
					root: ["./"],
					alias: {
						// Ten alias musi być zgodny z Twoim tsconfig.json
						"@": "./src",
						"@components": "./src/components",
					},
					extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
				},
			],
		],
	};
};
