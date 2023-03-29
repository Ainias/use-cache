"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReloadProvider = void 0;
const react_1 = require("react");
const ReloadContext_1 = require("./ReloadContext");
exports.ReloadProvider = react_1.default.memo(function ReloadProvider({ children }) {
    // Variables
    // Refs
    // States
    const key = (0, ReloadContext_1.useReloadId)();
    // Selectors
    // Callbacks
    // Effects
    // Other
    // Render Functions
    return react_1.default.createElement(ReloadContext_1.ReloadContext.Provider, { value: key }, children);
});
//# sourceMappingURL=ReloadProvider.js.map