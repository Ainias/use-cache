import React, { useRef } from 'react';

export const ReloadContext = React.createContext<number>(1);

let nextId = 2;

export function useReloadId() {
    const key = useRef(nextId);
    if (key.current === nextId) {
        nextId++;
    }
    return key.current;
}
