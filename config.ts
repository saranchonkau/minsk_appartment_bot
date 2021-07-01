import { parse } from "yaml";
import { readFileSync } from "fs";
import * as path from "path";

export interface UserModel {
  name: string;
  config: {
    bot_token: string;
    chat_id: number;
    onliner_params: Array<{ [key: string]: string | number }>;
  };
}

export interface ConfigModel {
  users: Array<UserModel>;
}

const configContent = readFileSync(path.resolve(__dirname, "config.yml"));

export const config: ConfigModel = parse(configContent.toString());
