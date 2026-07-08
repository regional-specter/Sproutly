import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/waitlist.functions-DQ7Yu5OM.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function readEnv(...keys) {
	for (const key of keys) {
		const fromProcess = typeof processModule !== "undefined" ? processModule.env[key] : void 0;
		if (fromProcess) return fromProcess;
		const fromVite = {
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SSR": true,
			"TSS_DEV_SERVER": "false",
			"TSS_DEV_SSR_STYLES_BASEPATH": "/",
			"TSS_DEV_SSR_STYLES_ENABLED": "true",
			"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
			"TSS_INLINE_CSS_ENABLED": "false",
			"TSS_ROUTER_BASEPATH": "",
			"TSS_SERVER_FN_BASE": "/_serverFn/",
			"VITE_SUPABASE_ANON_KEY": "sb_publishable_7xLNg1FGAohWP5iQssk6Wg_QII3h5cm",
			"VITE_SUPABASE_URL": "https://qjfennlxhxawtqlrzgop.supabase.co"
		}[key];
		if (fromVite) return fromVite;
	}
}
function getSupabaseEnv() {
	const url = readEnv("VITE_SUPABASE_URL", "SUPABASE_URL", "EXPO_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL");
	const anonKey = readEnv("VITE_SUPABASE_ANON_KEY", "SUPABASE_ANON_KEY", "EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "EXPO_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY");
	if (!url || !anonKey) throw new Error("Missing Supabase env. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to website/.env.local");
	return {
		url,
		anonKey
	};
}
var client;
function getSupabase() {
	if (client) return client;
	const { url, anonKey } = getSupabaseEnv();
	client = createClient(url, anonKey, { auth: {
		persistSession: false,
		autoRefreshToken: false,
		detectSessionInUrl: false
	} });
	return client;
}
var joinWaitlistInput = objectType({ email: stringType().trim().email("Enter a valid email address").transform((email) => email.toLowerCase()) });
var joinWaitlist_createServerFn_handler = createServerRpc({
	id: "84d93890dd9c1e59a64f5ae8101da2c7f60e63742e9ff41c41f350a81144ccda",
	name: "joinWaitlist",
	filename: "src/lib/waitlist.functions.ts"
}, (opts) => joinWaitlist.__executeServer(opts));
var joinWaitlist = createServerFn({ method: "POST" }).validator((input) => {
	const parsed = joinWaitlistInput.safeParse(input);
	if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Enter a valid email address");
	return parsed.data;
}).handler(joinWaitlist_createServerFn_handler, async ({ data }) => {
	const { error } = await getSupabase().from("waitlist").insert({
		email: data.email,
		source: "website"
	});
	if (error) {
		if (error.code === "23505") return {
			ok: true,
			alreadyJoined: true
		};
		console.error("waitlist insert failed", error.message, error.code);
		throw new Error("Could not join the waitlist. Please try again.");
	}
	return {
		ok: true,
		alreadyJoined: false
	};
});
//#endregion
export { joinWaitlist_createServerFn_handler };
