globalThis.__nitro_main__ = import.meta.url;
import { a as FastResponse, n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"d657-T1uS+22XBsV3EnUUekKqKBqSh6U\"",
		"mtime": "2026-07-07T08:38:04.902Z",
		"size": 54871,
		"path": "../public/favicon.ico"
	},
	"/assets/feature-care-sV5m1NPM.png": {
		"type": "image/png",
		"etag": "\"beb7-OhaIztjp1xqtl21e4yG0aoQCg9g\"",
		"mtime": "2026-07-07T08:38:04.761Z",
		"size": 48823,
		"path": "../public/assets/feature-care-sV5m1NPM.png"
	},
	"/embed.jpg": {
		"type": "image/jpeg",
		"etag": "\"289cc-a3WFcHG7nIolJQ+BnEaLQ5MM17U\"",
		"mtime": "2026-07-07T08:38:04.902Z",
		"size": 166348,
		"path": "../public/embed.jpg"
	},
	"/assets/feature-reminder-CItlyS5T.png": {
		"type": "image/png",
		"etag": "\"12135-50nYO4aGH4/vzwhDePCEsXwpDRY\"",
		"mtime": "2026-07-07T08:38:04.761Z",
		"size": 74037,
		"path": "../public/assets/feature-reminder-CItlyS5T.png"
	},
	"/assets/feature-score-BQb7ml0A.png": {
		"type": "image/png",
		"etag": "\"b19a-KQUFOpCkgWJT80jz9HZc/WoQ7u0\"",
		"mtime": "2026-07-07T08:38:04.761Z",
		"size": 45466,
		"path": "../public/assets/feature-score-BQb7ml0A.png"
	},
	"/assets/logo-D7hjP5xy.png": {
		"type": "image/png",
		"etag": "\"23d2-FMN1nrbKidzUhJijHWoJX479138\"",
		"mtime": "2026-07-07T08:38:04.762Z",
		"size": 9170,
		"path": "../public/assets/logo-D7hjP5xy.png"
	},
	"/assets/logo-white-CPvaKe1A.png": {
		"type": "image/png",
		"etag": "\"3145-wQAUdpA+EOtq47H3TBXK/6np2PA\"",
		"mtime": "2026-07-07T08:38:04.762Z",
		"size": 12613,
		"path": "../public/assets/logo-white-CPvaKe1A.png"
	},
	"/assets/routes-D12aMpqf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e63-PMe/qWdNHSC7THVtypWxp/waHgg\"",
		"mtime": "2026-07-07T08:38:04.760Z",
		"size": 15971,
		"path": "../public/assets/routes-D12aMpqf.js"
	},
	"/assets/feature-scan-CSdQT5AT.png": {
		"type": "image/png",
		"etag": "\"1be38-saDomPnBNiFJ/mQFTX+ZQyzsNKI\"",
		"mtime": "2026-07-07T08:38:04.761Z",
		"size": 114232,
		"path": "../public/assets/feature-scan-CSdQT5AT.png"
	},
	"/assets/screen-detail-DyUtk2uq.png": {
		"type": "image/png",
		"etag": "\"5b24e-6zIBMyLkZc80r0Ak4TNtH7jO4V0\"",
		"mtime": "2026-07-07T08:38:04.762Z",
		"size": 373326,
		"path": "../public/assets/screen-detail-DyUtk2uq.png"
	},
	"/assets/screen-home-FtY_xII_.png": {
		"type": "image/png",
		"etag": "\"4a679-pMr9j4K2+yg3cPdSf8r+rEIKuIM\"",
		"mtime": "2026-07-07T08:38:04.764Z",
		"size": 304761,
		"path": "../public/assets/screen-home-FtY_xII_.png"
	},
	"/assets/styles-Du-oXpdo.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"13107-hPtMHv4oM94kLLS/3vpPaNjsPMA\"",
		"mtime": "2026-07-07T08:38:04.764Z",
		"size": 78087,
		"path": "../public/assets/styles-Du-oXpdo.css"
	},
	"/assets/index-D6CMR9c6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"54379-eEkQ9CGlE17/m8/foSOFuTZrmpI\"",
		"mtime": "2026-07-07T08:38:04.758Z",
		"size": 344953,
		"path": "../public/assets/index-D6CMR9c6.js"
	},
	"/assets/footer-bg-DMSV13zh.png": {
		"type": "image/png",
		"etag": "\"e78c0-P3nC1GOm4i1J3aR9q01cGynkTyg\"",
		"mtime": "2026-07-07T08:38:04.762Z",
		"size": 948416,
		"path": "../public/assets/footer-bg-DMSV13zh.png"
	},
	"/assets/bg-elements-CrlOKLQt.png": {
		"type": "image/png",
		"etag": "\"137c30-QTH1pTgcIH84Hm6kDU81B1JUSCQ\"",
		"mtime": "2026-07-07T08:38:04.760Z",
		"size": 1276976,
		"path": "../public/assets/bg-elements-CrlOKLQt.png"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_SeAeqp = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_SeAeqp
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
