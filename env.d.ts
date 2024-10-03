/// <reference types="vite/client" />
/// <reference types="view-transitions-api-types" />
interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
