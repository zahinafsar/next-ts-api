export const logger: Pick<Console, "error" | "info"> = {
  error: (str: string) => console.error("[next-ts-api] " + str),
  info: (str: string) => console.info("[next-ts-api] " + str),
};
