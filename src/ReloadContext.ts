import  { createContext, useRef } from 'react';


export const ReloadContext = createContext<number>(1);

let nextId = 2;

export function useReloadId() {
    const key = useRef(nextId);
    if (key.current === nextId) {
        nextId++;
    }
    return key.current;
}
