import fileInfo from "./fileInfo.json";

type Asset<S> = {
  [key in keyof S]: string;
};

export declare const assets : Partial<Asset<typeof fileInfo.files>>
