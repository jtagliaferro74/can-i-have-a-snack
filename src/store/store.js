import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
	state: {
		snackState: "start",
		endTime: "",
		timerMinutes: 30,
	},
	mutations: {
		setSnackState(state, payload) {
			state.snackState = payload;
		},
		setTimerMinutes(state, payload) {
			state.timerMinutes = payload;
		},
		setEndTime(state, payload) {
			state.endTime = payload;
		},
	},
	plugins: [createPersistedState()],
});

export default store;
