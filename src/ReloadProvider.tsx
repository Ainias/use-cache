import React, { ReactNode } from 'react';
import { ReloadContext, useReloadId } from './ReloadContext';

export type ReloadProviderProps = { children: ReactNode };

export const ReloadProvider = React.memo(function ReloadProvider({ children }: ReloadProviderProps) {
    // Variables

    // Refs

    // States
    const key = useReloadId();

    // Selectors

    // Callbacks

    // Effects

    // Other

    // Render Functions

    return <ReloadContext.Provider value={key}>{children}</ReloadContext.Provider>;
});
