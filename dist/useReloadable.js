"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReloadable = void 0;
const react_1 = require("react");
const useReloadStore_1 = require("./useReloadStore");
const shallow_1 = require("zustand/shallow");
const ReloadContext_1 = require("./ReloadContext");
function useReloadable(keyOrFunc, funcOrLoadingState, maybeInitialLoadingState) {
    const [generateKey, setIsRunning, setLoadingState, setItem, registerListener, removeListener] = (0, useReloadStore_1.useReloadStore)((s) => [s.generateKey, s.setIsRunning, s.setLoadingState, s.setItem, s.registerListener, s.removeListener], shallow_1.shallow);
    let key;
    let initialLoadingState;
    let reloadFunction;
    if (typeof keyOrFunc === 'function') {
        initialLoadingState = funcOrLoadingState;
        reloadFunction = keyOrFunc;
    }
    else {
        key = keyOrFunc;
        reloadFunction = funcOrLoadingState;
        initialLoadingState = maybeInitialLoadingState;
    }
    const keyRef = (0, react_1.useRef)(key !== undefined ? key : generateKey());
    let entry = (0, useReloadStore_1.useReloadStore)((s) => s.reloadItems[keyRef.current]);
    if (!entry) {
        const setLoadingStateInner = (newLoadingState) => setLoadingState(keyRef.current, newLoadingState);
        entry = {
            key: keyRef.current,
            initialLoadingState,
            loadingState: initialLoadingState,
            isRunning: false,
            listenerCount: 0,
            reloadFunction: () => __awaiter(this, void 0, void 0, function* () {
                // Prevent double running or running when no one waits
                const currentEntry = useReloadStore_1.useReloadStore.getState().reloadItems[keyRef.current];
                if ((currentEntry === null || currentEntry === void 0 ? void 0 : currentEntry.isRunning) || !(currentEntry === null || currentEntry === void 0 ? void 0 : currentEntry.listenerCount)) {
                    return;
                }
                setIsRunning(keyRef.current, true, initialLoadingState);
                yield reloadFunction(setLoadingStateInner);
                setIsRunning(keyRef.current, false);
            }),
        };
        setItem(entry);
    }
    const contextKey = (0, react_1.useContext)(ReloadContext_1.ReloadContext);
    (0, react_1.useEffect)(() => {
        const currentKey = keyRef.current;
        registerListener(currentKey, contextKey);
        return () => removeListener(currentKey, contextKey);
    }, [contextKey, registerListener, removeListener]);
    return [entry.reloadFunction, { loadingState: entry.loadingState, isLoading: entry.isRunning }];
}
exports.useReloadable = useReloadable;
//# sourceMappingURL=useReloadable.js.map