import VError from 'verror';

export function throwErrorException(msg: string, res: string, status: number): Promise<never> {
  throw new VError(
        {
          info: {
            statusCode: status,
            response: res,
          },
        },
        msg,
    );
}