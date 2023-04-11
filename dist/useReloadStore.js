"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReloadStore = void 0;
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const js_helper_1 = require("@ainias42/js-helper");
const initialState = {
    lastKey: 0,
    reloadItems: {},
    containers: {},
};
const actionsGenerator = (set, get) => ({
    clear() {
        set(Object.assign({}, actionsGenerator(set, get)), true);
    },
    generateKey() {
        let currentKey = get().lastKey;
        do {
            currentKey++;
        } while (get().reloadItems[currentKey]);
        set({ lastKey: currentKey });
        return currentKey;
    },
    setIsRunning(key, isRunning, loadingState) {
        set((state) => {
            if (state.reloadItems[key]) {
                state.reloadItems[key].isRunning = isRunning;
                if (loadingState !== undefined) {
                    state.reloadItems[key].loadingState = loadingState;
                }
            }
        });
    },
    setLoadingState(key, loadingState) {
        set((state) => {
            if (state.reloadItems[key]) {
                state.reloadItems[key].loadingState = loadingState;
            }
        });
    },
    setItem(item) {
        set((state) => {
            if (!state.reloadItems[item.key]) {
                state.reloadItems[item.key] = item;
            }
        });
    },
    registerListener(key, containerKey) {
        set((state) => {
            var _a;
            if (state.reloadItems[key]) {
                state.reloadItems[key].listenerCount++;
                state.containers[containerKey] = (_a = state.containers[containerKey]) !== null && _a !== void 0 ? _a : {};
                state.containers[containerKey][key] = true;
            }
        });
    },
    removeListener(key, containerKey) {
        set((state) => {
            if (state.reloadItems[key]) {
                state.reloadItems[key].listenerCount--;
                if (state.reloadItems[key].listenerCount < 0) {
                    state.reloadItems[key].listenerCount = 0;
                }
                if (state.containers[containerKey]) {
                    delete state.containers[containerKey][key];
                }
            }
        });
    },
    reloadContainer(containerKey) {
        var _a;
        const { containers, reloadItems } = get();
        return Promise.all(js_helper_1.ObjectHelper.keys((_a = containers[containerKey]) !== null && _a !== void 0 ? _a : {}).map((key) => { var _a; return (_a = reloadItems[key]) === null || _a === void 0 ? void 0 : _a.reloadFunction().catch((e) => console.error('Reloading container error: ', e)); }));
    },
});
exports.useReloadStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => (Object.assign(Object.assign({}, initialState), actionsGenerator(set, get)))));
//# sourceMappingURL=useReloadStore.js.map