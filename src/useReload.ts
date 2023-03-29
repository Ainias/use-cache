import { useCallback, useContext } from 'react';
import { ReloadContext } from './ReloadContext';
import { useReloadStore } from './useReloadStore';
import { ObjectHelper } from '@ainias42/js-helper/dist/ObjectHelper';

export function useReload() {
    const containerKey = useContext(ReloadContext);
    const isLoading = useReloadStore((s) =>
        ObjectHelper.keys(s.containers[containerKey] ?? {}).some((key) => s.reloadItems[key]?.isRunning)
    );
    const reloadContainer = useReloadStore((s) => s.reloadContainer);
    const reload = useCallback(() => reloadContainer(containerKey), [containerKey, reloadContainer]);
    return [reload, isLoading] as const;
}
