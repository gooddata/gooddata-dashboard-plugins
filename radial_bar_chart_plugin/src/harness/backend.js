// (C) 2019-2022 GoodData Corporation
import tigerFactory, {
    TigerTokenAuthProvider,
    ContextDeferredAuthProvider,
} from "@gooddata/sdk-backend-tiger";

export function hasCredentialsSetup() {
    return !!process.env.TIGER_API_TOKEN;
}

export function needsAuthentication() {
    return true;
}

function getBackend() {
    const newBackend = tigerFactory();

    if (hasCredentialsSetup()) {
        return newBackend.withAuthentication(new TigerTokenAuthProvider(process.env.TIGER_API_TOKEN));
    }

    return newBackend.withAuthentication(new ContextDeferredAuthProvider());
}

export const backend = getBackend();
