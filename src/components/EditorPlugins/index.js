import MathPlugin from './MathPlugin';


export default {
	math: {
		component: MathPlugin,
		rule: /^(:{2})math(:{2})(.*)(:{2})/,
		inline: true,
		inlineFunc: function(cap, renderer) {
			return renderer(cap[3]);
		},
		capFunc: function(src, cap) {
			return { type: 'math', text: cap[3] };
		},
		tokenFunc: function(token, renderer) {
			return renderer(token.text);
		}
	},
	img: {
		component: MathPlugin,
		inline: false,
		rule: /(:{2})img(:{2})([^\n]+?)(:{2})/,
		capFunc: function(src, cap) {
			return { type: 'img', ntext: cap[3] };
		},
		tokenFunc: function(token, renderer) {
			return renderer(token.text);
		}
	}
};
