import { LoadingKey } from './useReloadStore';
export type ReloadOptions = {
    initialState?: number;
};
export type SetLoadingState = (loadingState: number) => void;
export type ReloadFunctionWithLoadingState<T> = (setLoadingState: SetLoadingState) => Promise<T>;
export type ReloadFunctionWithoutLoadingState<T> = () => Promise<T>;
export type ReloadFunction<T> = ReloadFunctionWithLoadingState<T> | ReloadFunctionWithoutLoadingState<T>;
export declare function useReloadable<T>(key: LoadingKey, func: ReloadFunctionWithoutLoadingState<T>): any;
export declare function useReloadable<T>(key: LoadingKey, func: ReloadFunctionWithLoadingState<T>, initialLoadingState: number): any;
export declare function useReloadable<T>(func: ReloadFunctionWithoutLoadingState<T>): any;
export declare function useReloadable<T>(func: ReloadFunctionWithLoadingState<T>, initialLoadingState: number): any;
