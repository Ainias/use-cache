import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { ReloadFunctionWithoutLoadingState } from './useReloadable';
import { immer } from 'zustand/middleware/immer';
import { ObjectHelper } from '@ainias42/js-helper';

export type ReloadStateItem = {
    key: number | string;
    reloadFunction: ReloadFunctionWithoutLoadingState<any>;
    loadingState?: number;
    initialLoadingState?: number;
    isRunning: boolean;
    listenerCount: number;
};

export type LoadingKey = string | number;

const initialState = {
    lastKey: 0,
    reloadItems: {} as Record<LoadingKey, ReloadStateItem | undefined>,
    containers: {} as Record<number, Record<LoadingKey, true>>,
};
export type ReloadStoreState = typeof initialState & ReturnType<typeof actionsGenerator>;

type SetState = (
    newState:
        | ReloadStoreState
        | Partial<ReloadStoreState>
        | ((state: ReloadStoreState) => ReloadStoreState | Partial<ReloadStoreState> | void),
    replace?: boolean
) => void;
type GetState = () => Readonly<ReloadStoreState>;

const actionsGenerator = (set: SetState, get: GetState) => ({
    clear() {
        set({ ...actionsGenerator(set, get) }, true);
    },
    generateKey() {
        let currentKey = get().lastKey;
        while (get().reloadItems[currentKey]) {
            currentKey++;
        }
        set({ lastKey: currentKey });
        return currentKey;
    },
    setIsRunning(key: LoadingKey, isRunning: boolean, loadingState?: number) {
        set((state) => {
            if (state.reloadItems[key]) {
                state.reloadItems[key].isRunning = isRunning;
                if (loadingState !== undefined) {
                    state.reloadItems[key].loadingState = loadingState;
                }
            }
        });
    },
    setLoadingState(key: LoadingKey, loadingState: number) {
        set((state) => {
            if (state.reloadItems[key]) {
                state.reloadItems[key].loadingState = loadingState;
            }
        });
    },
    setItem(item: ReloadStateItem) {
        set((state) => {
            if (!state.reloadItems[item.key]) {
                state.reloadItems[item.key] = item;
            }
        });
    },
    registerListener(key: LoadingKey, containerKey: number) {
        set((state) => {
            if (state.reloadItems[key]) {
                state.reloadItems[key].listenerCount++;
                state.containers[containerKey] = state.containers[containerKey] ?? {};
                state.containers[containerKey][key] = true;
            }
        });
    },
    removeListener(key: LoadingKey, containerKey: number) {
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
    reloadContainer(containerKey: number) {
        const { containers, reloadItems } = get();
        return Promise.all(
            ObjectHelper.keys(containers[containerKey] ?? {}).map((key) =>
                reloadItems[key]?.reloadFunction().catch((e) => console.error('Reloading container error: ', e))
            )
        );
    },
});

export const useReloadStore = create<ReloadStoreState>()(
    persist(
        immer((set, get) => ({
            ...initialState,
            ...actionsGenerator(set, get),
        })),
        {
            name: 'ReloadStore',
            version: 0,
        }
    )
);
