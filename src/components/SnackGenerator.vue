<template>
	<div id="content">
		<button id="settings-btn" @click="showSettings = !showSettings">
			<Icon id="settings-icon" icon="ci:settings-filled" width="32" color="#ffffff" />
		</button>
		<transition name="switch" mode="out-in">
			<div class="card" v-if="!showSettings">
				<transition name="switch" mode="out-in">
					<div class="card-body" :key="snackState">
						<h1>{{ snackHeading }}</h1>
						<p v-show="snackString">
							{{ snackString }}
						</p>
						<Icon id="main-icon" :icon="snackIcon" width="60%" color="#d07542" />
					</div>
				</transition>

				<button id="main-btn" type="button" @click="check" :disabled="!button.clickable">
					{{ button.text }}
					<vue-countdown
						v-if="snackState === 'resultNo'"
						@finished="countdownOver"
						:endDateTime="new Date(endTime)"
					>
						<template v-slot:default="{ countdown }" :endDateTime="new Date(endTime)">
							{{ formatDigit(countdown.remainingHours.value) }}:{{
								formatDigit(countdown.remainingMinutes.value)
							}}:{{ formatDigit(countdown.remainingSeconds.value) }}
						</template>
					</vue-countdown>
				</button>
			</div>
			<div v-else class="settings-card">
				<h2>Settings</h2>
				<form @submit.prevent="saveSettings">
					<div class="form-control">
						<label for="minutes">Timer (minutes)</label>
						<input
							id="minutes"
							inputmode="numeric"
							type="number"
							v-model="settingsTime"
							min="5"
							max="480"
						/>
					</div>
					<div class="buttons-container">
						<button class="save-btn">Save</button>
						<button
							type="button"
							@click="showSettings = !showSettings"
							class="cancel-btn"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</transition>
		<Icon class="left-icon" icon="fluent:food-pizza-24-regular" color="#d0754230" width="25%" />
		<Icon
			class="right-icon"
			icon="fluent:food-apple-24-regular"
			color="#d0754230"
			width="25%"
		/>
	</div>
</template>

<script>
	import { Icon } from "@iconify/vue";
	export default {
		name: "SnackGenerator",
		components: {
			Icon,
		},
		created() {
			// reset to start state if result is yes
			if (
				this.$store.state.snackState === "resultYes" ||
				this.$store.state.snackState === "checking"
			) {
				this.$store.commit("setSnackState", "start");
			}
			//disable button and clear button text
			if (this.$store.state.snackState === "resultNo") {
				this.button = {
					text: "",
					clickable: false,
				};
			}
		},
		data() {
			return {
				settingsTime: this.$store.state.timerMinutes,
				showSettings: false,
				button: {
					text: "Let's Check!",
					clickable: true,
				},
			};
		},
		computed: {
			// vuex state variables
			snackState: function () {
				return this.$store.state.snackState;
			},
			timerMinutes: function () {
				return this.$store.state.timerMinutes;
			},
			endTime: function () {
				return this.$store.state.endTime;
			},

			// determine h1 text depending on snackState
			snackHeading: function () {
				let heading = "Can i have a Snack?";
				switch (this.$store.state.snackState) {
					case "checking":
						heading = "Checking...";
						break;
					case "resultYes":
						heading = "Yes!";
						break;
					case "resultNo":
						heading = "Nope.";
						break;

					default:
						heading = "Can i have a snack?";
						break;
				}

				return heading;
			},

			// determine p text depending on snackState
			snackString: function () {
				let str = "";
				switch (this.$store.state.snackState) {
					case "resultYes":
						str = "Woohoo! Snacktime!";
						break;
					case "resultNo":
						str = "Maybe in a little bit...";
						break;
					default:
						str = "";
						break;
				}

				return str;
			},
			// determine icon image depending on snackState
			snackIcon: function () {
				let icon = "mdi:pretzel";
				switch (this.$store.state.snackState) {
					case "resultYes":
						icon = "healthicons:happy";
						break;
					case "resultNo":
						icon = "healthicons:sad";
						break;
					case "checking":
						icon = "eos-icons:three-dots-loading";
						break;
					default:
						icon = "mdi:pretzel";
						break;
				}

				return icon;
			},
		},
		methods: {
			//return stringified value with leading 0 if necessary
			formatDigit(val) {
				return val > 10 ? `${val}` : `0${val}`;
			},

			// for dev use only to reset timer.
			reset() {
				this.$store.commit("setEndTime", Date.now());
			},

			// executes when countdown ends.
			countdownOver() {
				// set snack state to true
				this.$store.commit("setSnackState", "start");
				// reset button values
				this.button.clickable = true;
				this.button.text = "Let's Check!";
			},

			// initiates checking sequence.
			// sets state to "checking" for 2 seconds then continues to next step
			check() {
				this.$store.commit("setSnackState", "checking");
				this.button.clickable = false;
				setTimeout(() => {
					this.flipCoin();
				}, 2000);
			},

			flipCoin() {
				// generate a boolean by "flipping a coin"
				let snackResult = Math.random() > 0.5 ? true : false;

				if (snackResult) {
					// result is YES
					this.$store.commit("setSnackState", "resultYes");
					this.button.clickable = true; // re-enable button
				} else {
					// result is NO
					this.$store.commit("setSnackState", "resultNo");

					// generate new end time based on:
					// current time + (number of minutes * 60000 miliseconds) [60000ms = 1 min]
					// date has to be stored as a string because that's what the countdown component accepts
					this.$store.commit(
						"setEndTime",
						new Date(Date.now() + this.$store.state.timerMinutes * 60000).toString()
					);

					// disable button and clear text
					this.button.clickable = false;
					this.button.text = "";
				}
			},

			// save settings
			saveSettings() {
				this.$store.commit("setTimerMinutes", this.settingsTime);
				this.showSettings = false;
			},
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.settings-card,
	.card {
		width: 100%;
		max-width: 70%;
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 64px;
		transition: all 0.2s ease-out;
	}

	.card-body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.form-control {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #825e44;
	}

	/* Remove arrows from number input */
	/* Chrome, Safari, Edge, Opera */
	.form-control input::-webkit-outer-spin-button,
	.form-control input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Remove arrows from number input */
	/* Firefox */
	.form-control input[type="number"] {
		-moz-appearance: textfield;
	}

	.form-control input {
		font-family: "Patrick Hand SC", Helvetica, Arial, sans-serif;
		text-align: center;
		font-size: 2em;
		width: 64px;
		color: #825e44;
		border: 5px solid #d07542;
		border-radius: 16px;
		outline: none;
	}

	.form-control label {
		font-size: 2em;
		width: 200px;
	}

	h1 {
		margin: 0;
		font-size: 6em;
		text-align: center;
		line-height: 100px;
		color: #825e44;
		z-index: 1;
	}

	h2 {
		margin: 0;
		margin-bottom: 0.25em;
		font-size: 4.6em;
		text-align: center;
		line-height: 100px;
		color: #825e44;
		z-index: 1;
	}

	#main-btn {
		font-family: "Patrick Hand SC", Helvetica, Arial, sans-serif;
		color: white;
		background-color: #da9169;
		font-size: 2em;
		padding: 10px 60px;
		border: 8px solid #d07542;
		border-radius: 50px;
		cursor: pointer;
		display: block;
		transition: all 0.2s cubic-bezier(0.75, 1.77, 0.73, 0.84);
		z-index: 10;
		width: 280px;
	}
	#main-btn:hover {
		background-color: #d68454;
	}

	#settings-btn {
		position: absolute;
		right: 8px;
		top: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		background-color: #b0bdae;
		padding: 6px;
		border: 6px solid #889787;
		border-radius: 50px;
		cursor: pointer;
		z-index: 10;
		transition: all 0.2s cubic-bezier(0.75, 1.77, 0.73, 0.84);
	}

	#settings-btn #settings-icon {
		transition: all 0.4s cubic-bezier(0.75, 1.77, 0.73, 0.84);
	}

	#settings-btn:hover #settings-icon {
		transform: rotate(87deg) scale(1.1);
	}

	.buttons-container {
		z-index: 1;
		margin-top: 1em;
		display: flex;
		justify-content: space-between;
	}

	.save-btn,
	.cancel-btn {
		width: 45%;
		padding: 4px 0px;
		color: white;
		font-family: "Patrick Hand SC", Helvetica, Arial, sans-serif;
		font-size: 2em;
		border-radius: 16px;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.75, 1.77, 0.73, 0.84);
		text-align: center;
	}

	.save-btn {
		background-color: #da9169;
		border: 6px solid #d07542;
	}
	.save-btn:hover {
		background-color: #d68454;
	}
	.cancel-btn {
		background-color: #b0bdae;
		border: 6px solid #889787;
	}
	.cancel-btn:hover {
		background-color: #a0ad9f;
	}

	/* little scale animation for all buttons when clicked */
	button:active {
		transform: scale(0.9);
	}

	p {
		margin-bottom: 0em;
		font-size: 2em;
		color: #825e44;
		text-align: center;
	}

	.left-icon {
		position: absolute;
		left: 30px;
		top: 150px;
		z-index: 0;
	}
	.right-icon {
		position: absolute;
		right: 40px;
		top: 400px;
		z-index: 0;
	}

	.left-icon,
	.right-icon {
		transition: all 2.5s ease-out;
	}

	.left-icon:hover,
	.right-icon:hover {
		transform: scale(1.1) translateY(-80px);
	}
	#main-icon {
		max-height: 300px;
		min-width: 250px;
	}

	/* switch transitions */
	.switch-enter-from,
	.switch-leave-to {
		opacity: 0;
		transform: translateY(20px);
	}

	.switch-enter-to,
	.switch-leave-from {
		opacity: 1;
		transform: translateY(0);
	}

	.switch-enter-active {
		transition: all 0.5s ease;
	}

	.switch-leave-active {
		transition: all 0.5s ease;
	}

	@media screen and (max-width: 768px) {
		.left-icon,
		.right-icon {
			display: none;
		}

		h1 {
			font-size: 4.6em;
			line-height: 80px;
		}

		#main-btn {
			font-size: 1.5em;
			padding: 10px 40px;
		}

		p {
			margin-top: 0;
		}
	}
</style>
