import VError from 'verror';

export function throwErrorException(msg: string, res: string, status: number): never {
  const error = new VError(msg);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error as any).statusCode = status;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error as any).response = res;
  throw error;
}