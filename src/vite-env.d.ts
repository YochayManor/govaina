/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly NODE_ENV: 'development' | 'production' | undefined;
    readonly OPENAI_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}