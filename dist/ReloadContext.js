"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReloadId = exports.ReloadContext = void 0;
const react_1 = require("react");
exports.ReloadContext = react_1.default.createContext(1);
let nextId = 2;
function useReloadId() {
    const key = (0, react_1.useRef)(nextId);
    if (key.current === nextId) {
        nextId++;
    }
    return key.current;
}
exports.useReloadId = useReloadId;
//# sourceMappingURL=ReloadContext.js.map