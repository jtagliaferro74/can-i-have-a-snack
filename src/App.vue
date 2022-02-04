<template>
	<div>
		<SnackGenerator />
		<svg class="curve" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 300">
			<path
				fill="#b0bdae"
				fill-opacity="1"
				d="M0,224L60,197.3C120,171,240,117,360,128C480,139,600,213,720,218.7C840,224,960,160,1080,144C1200,128,1320,160,1380,176L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
			></path>
		</svg>
		<footer class="footer">
			<small>Copyright &copy; {{ currentYear }} Joe Tagliaferro</small>
		</footer>
	</div>
</template>

<script>
	import SnackGenerator from "./components/SnackGenerator.vue";

	export default {
		name: "App",
		components: {
			SnackGenerator,
		},
		created() {
			document.title = "Can I Have a Snack?";
			this.currentYear = new Date().getFullYear();
		},
		data() {
			return {
				currentYear: 2021,
			};
		},
	};
</script>

<style>
	@import url("https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap");
	#app {
		font-family: "Patrick Hand SC", Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	body {
		margin: 0;
	}

	html,
	body {
		height: 100%;
		position: relative;
	}

	.curve {
		border: none;
		position: fixed;
		bottom: 0;
		width: 100%;
		z-index: -10;
	}

	.footer {
		color: #535c53;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;
		font-family: Arial, sans-serif;
		position: fixed;
		bottom: 4px;
		text-align: center;
	}
</style>
