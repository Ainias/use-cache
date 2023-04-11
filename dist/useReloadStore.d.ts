import type { ReloadFunctionWithoutLoadingState } from './useReloadable';
export type ReloadStateItem = {
    key: number | string;
    reloadFunction: ReloadFunctionWithoutLoadingState<any>;
    loadingState?: number;
    initialLoadingState?: number;
    isRunning: boolean;
    listenerCount: number;
};
export type LoadingKey = string | number;
declare const initialState: {
    lastKey: number;
    reloadItems: Record<LoadingKey, ReloadStateItem>;
    containers: Record<number, Record<LoadingKey, true>>;
};
export type ReloadStoreState = typeof initialState & ReturnType<typeof actionsGenerator>;
type SetState = (newState: ReloadStoreState | Partial<ReloadStoreState> | ((state: ReloadStoreState) => ReloadStoreState | Partial<ReloadStoreState> | void), replace?: boolean) => void;
type GetState = () => Readonly<ReloadStoreState>;
declare const actionsGenerator: (set: SetState, get: GetState) => {
    clear(): void;
    generateKey(): number;
    setIsRunning(key: LoadingKey, isRunning: boolean, loadingState?: number): void;
    setLoadingState(key: LoadingKey, loadingState: number): void;
    setItem(item: ReloadStateItem): void;
    registerListener(key: LoadingKey, containerKey: number): void;
    removeListener(key: LoadingKey, containerKey: number): void;
    reloadContainer(containerKey: number): Promise<any[]>;
};
export declare const useReloadStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<ReloadStoreState>, "setState"> & {
    setState(nextStateOrUpdater: ReloadStoreState | Partial<ReloadStoreState> | ((state: import("immer/dist/internal").WritableDraft<ReloadStoreState>) => void), shouldReplace?: boolean): void;
}>;
export {};
