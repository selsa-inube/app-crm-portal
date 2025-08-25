import { headers } from "./config";

type HeaderKey = (typeof headers)[number]["key"];

export type CurrentDataRow = Record<HeaderKey, string>;
