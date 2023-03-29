import { useContext, useEffect, useRef } from 'react';
import { LoadingKey, useReloadStore } from './useReloadStore';
import { shallow } from 'zustand/shallow';
import { ReloadContext } from './ReloadContext';

export type ReloadOptions = {
    initialState?: number;
};
export type SetLoadingState = (loadingState: number) => void;
export type ReloadFunctionWithLoadingState<T> = (setLoadingState: SetLoadingState) => Promise<T>;
export type ReloadFunctionWithoutLoadingState<T> = () => Promise<T>;

export type ReloadFunction<T> = ReloadFunctionWithLoadingState<T> | ReloadFunctionWithoutLoadingState<T>;

export function useReloadable<T>(key: LoadingKey, func: ReloadFunctionWithoutLoadingState<T>);
export function useReloadable<T>(key: LoadingKey, func: ReloadFunctionWithLoadingState<T>, initialLoadingState: number);
export function useReloadable<T>(func: ReloadFunctionWithoutLoadingState<T>);
export function useReloadable<T>(func: ReloadFunctionWithLoadingState<T>, initialLoadingState: number);
export function useReloadable<T>(
    keyOrFunc: LoadingKey | ReloadFunction<T>,
    funcOrLoadingState?: ReloadFunction<T> | number,
    maybeInitialLoadingState?: number
) {
    const [generateKey, setIsRunning, setLoadingState, setItem, registerListener, removeListener] = useReloadStore(
        (s) => [s.generateKey, s.setIsRunning, s.setLoadingState, s.setItem, s.registerListener, s.removeListener],
        shallow
    );

    let key: string | number | undefined;

    let initialLoadingState: number | undefined;
    let reloadFunction: ReloadFunction<T>;

    if (typeof keyOrFunc === 'function') {
        initialLoadingState = funcOrLoadingState as number | undefined;
        reloadFunction = keyOrFunc;
    } else {
        key = keyOrFunc;
        reloadFunction = funcOrLoadingState as ReloadFunction<T>;
        initialLoadingState = maybeInitialLoadingState;
    }

    const keyRef = useRef(key !== undefined ? key : generateKey());

    let entry = useReloadStore((s) => s.reloadItems[keyRef.current]);
    if (!entry) {
        const setLoadingStateInner = (newLoadingState: number) => setLoadingState(keyRef.current, newLoadingState);
        entry = {
            key: keyRef.current,
            initialLoadingState,
            loadingState: initialLoadingState,
            isRunning: false,
            listenerCount: 0,
            reloadFunction: async () => {
                // Prevent double running or running when no one waits
                const currentEntry = useReloadStore.getState().reloadItems[keyRef.current];
                if (currentEntry?.isRunning || !currentEntry?.listenerCount) {
                    return;
                }
                setIsRunning(keyRef.current, true, initialLoadingState);
                await reloadFunction(setLoadingStateInner);
                setIsRunning(keyRef.current, false);
            },
        };
        setItem(entry);
    }

    const contextKey = useContext(ReloadContext);
    useEffect(() => {
        const currentKey = keyRef.current;
        registerListener(currentKey, contextKey);
        return () => removeListener(currentKey, contextKey);
    }, [contextKey, registerListener, removeListener]);

    return [entry.reloadFunction, { loadingState: entry.loadingState, isLoading: entry.isRunning }] as const;
}
