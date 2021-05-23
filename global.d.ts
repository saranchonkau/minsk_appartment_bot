/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly BOT_TOKEN: string;
    readonly CHAT_ID: string;
  }
}
