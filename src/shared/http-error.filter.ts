import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common'

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const status = response.getStatus
      ? response.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR
    const errResponde = {
      code: status,
      timeStamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      message:
        status == HttpStatus.INTERNAL_SERVER_ERROR
          ? 'internal error'
          : exception.message.error || exception.message || null,
    }
    Logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errResponde),
      'ExceptionFilter',
    )
    response.status(status).json(errResponde)
  }
}
