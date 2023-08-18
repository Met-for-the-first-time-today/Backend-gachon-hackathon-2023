export const Jsend = (type: string, message: unknown, data?: unknown) => {
  return {
    status: type,
    message,
    data,
  };
};

export default {
  SUCCESS: (message: unknown, data?: unknown) =>
    Jsend("success", message, data),
  ERROR: (message: unknown) => Jsend("error", message),
  FAIL: (message: unknown) => Jsend("fail", message),
};
