//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-Dv5Hu77o.js
var manifest = { "84d93890dd9c1e59a64f5ae8101da2c7f60e63742e9ff41c41f350a81144ccda": {
	functionName: "joinWaitlist_createServerFn_handler",
	importer: () => import("./_ssr/waitlist.functions-DQ7Yu5OM.mjs")
} };
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
