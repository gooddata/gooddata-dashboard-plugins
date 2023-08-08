// (C) 2019-2023 GoodData Corporation
import tigerFactory, {
    ContextDeferredAuthProvider as TigerContextDeferredAuthProvider,
    TigerTokenAuthProvider,
} from "@gooddata/sdk-backend-tiger";
import bearFactory, {
    ContextDeferredAuthProvider as BearContextDeferredAuthProvider,
    FixedLoginAndPasswordAuthProvider,
} from "@gooddata/sdk-backend-bear";
import { IAnalyticalBackend } from "@gooddata/sdk-backend-spi";

export enum BackendType {
    Tiger = "tiger",
    Bear = "bear",
}

const isBearBackend = process.env.BACKEND_TYPE === BackendType.Bear;

export function hasCredentialsSetup(): boolean {
    return isBearBackend
        ? !!(process.env.GDC_USERNAME && process.env.GDC_PASSWORD)
        : !!process.env.TIGER_API_TOKEN;
}

function getTigerBackend(): IAnalyticalBackend {
    const newBackend = tigerFactory();

    if (hasCredentialsSetup()) {
        return newBackend.withAuthentication(new TigerTokenAuthProvider(process.env.TIGER_API_TOKEN!));
    }

    return newBackend.withAuthentication(new TigerContextDeferredAuthProvider());
}

function getBearBackend(): IAnalyticalBackend {
    const newBackend = bearFactory();

    if (hasCredentialsSetup()) {
        return newBackend.withAuthentication(
            new FixedLoginAndPasswordAuthProvider(process.env.GDC_USERNAME!, process.env.GDC_PASSWORD!),
        );
    }

    return newBackend.withAuthentication(new BearContextDeferredAuthProvider());
}

function getBackend() {
    return isBearBackend ? getBearBackend() : getTigerBackend();
}

export const backend = getBackend();
