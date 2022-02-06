import camelCase from "lodash/camelCase";
import { NamingStrategy } from "../transform";

export const removeInterpolation = (str: string) => {
  const interpolationMatch = str.match(/^\$\{(.*)\}$/);
  if (!interpolationMatch) return str;
  return interpolationMatch[1];
};

export const applyNamingStrategy = (
  name: string,
  namingStrategy: NamingStrategy
) => {
  return namingStrategy === "camel-case"
    ? camelCase(name)
    : name.replace(/\s/g, "");
};
