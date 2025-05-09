export function joinClass(...args: Array<string | boolean | undefined>) {
  return args
    .filter((str) => typeof str === 'string')
    .join(' ')
    .trim();
}

export function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result?.toString()?.split(',')?.[1] ?? '';
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const isTokenExpired = () => {
  const currentTime = Date.now();
  const tokenExpiration = sessionStorage.getItem('tokenExpiration');
  const tokenExpirationTimestamp = tokenExpiration ? parseInt(tokenExpiration) : 0;
  return currentTime > tokenExpirationTimestamp + 1 * 60 * 60 * 1000; // 1 hour
};

export function convertUrlSourceToFile(src: string, filename?: string): Promise<File> {
  return fetch(src)
    .then((res) => res.blob())
    .then((blob) => {
      const name = filename ?? src.split('/').pop() ?? 'file';
      return new File([blob], name, { type: blob.type });
    });
}
