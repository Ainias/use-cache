"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReload = void 0;
const react_1 = require("react");
const ReloadContext_1 = require("./ReloadContext");
const useReloadStore_1 = require("./useReloadStore");
const ObjectHelper_1 = require("@ainias42/js-helper/dist/ObjectHelper");
function useReload() {
    const containerKey = (0, react_1.useContext)(ReloadContext_1.ReloadContext);
    const isLoading = (0, useReloadStore_1.useReloadStore)((s) => { var _a; return ObjectHelper_1.ObjectHelper.keys((_a = s.containers[containerKey]) !== null && _a !== void 0 ? _a : {}).some((key) => { var _a; return (_a = s.reloadItems[key]) === null || _a === void 0 ? void 0 : _a.isRunning; }); });
    const reloadContainer = (0, useReloadStore_1.useReloadStore)((s) => s.reloadContainer);
    const reload = (0, react_1.useCallback)(() => reloadContainer(containerKey), [containerKey, reloadContainer]);
    return [reload, isLoading];
}
exports.useReload = useReload;
//# sourceMappingURL=useReload.js.map