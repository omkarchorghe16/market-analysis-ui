export function getApiErrorMessage(error, fallback) {
  const responseData = error?.response?.data;

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }

  if (responseData && typeof responseData === 'object') {
    const message = responseData.detail || responseData.message || responseData.title;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return error?.message || fallback;
}
