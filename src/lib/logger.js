import { pino } from 'pino'
import { context, trace, isSpanContextValid } from '@opentelemetry/api'
import config from '#config'

const escapeCodes = {
  reset: '\u001b[0m',
  cyan: '\u001b[36m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  red: '\u001b[31m',
  brightRed: '\u001b[31;1m',
}

const escapeCodeByLevel = {
  10: escapeCodes.reset,
  20: escapeCodes.reset,
  30: escapeCodes.green,
  40: escapeCodes.yellow,
  50: escapeCodes.red,
  60: escapeCodes.brightRed,
}

function messageFormat(log) {
  const uid = `${escapeCodes.reset}[${log.uid}]`
  const message = escapeCodeByLevel[log.level] + (log.msg ?? log.err?.message ?? '')

  if (log.uid) {
    return `${uid} ${message}`
  }

  return message
}

function otelMixin() {
  if (!config.otel.isEnabled) {
    return {}
  }

  const span = trace.getSpan(context.active())
  if (!span) {
    return {}
  }

  const spanContext = span.spanContext()
  if (!isSpanContextValid(spanContext)) {
    return {}
  }

  return {
    trace_id: spanContext.traceId,
    span_id: spanContext.spanId,
    trace_flags: `0${spanContext.traceFlags.toString(16)}`,
  }
}

const logger = pino({
  timestamp: true,
  level: config.log.level,
  base: {
    appVersion: config.version,
  },
  mixin: otelMixin,
  // TODO: v7+ transports
  // https://github.com/pinojs/pino/blob/master/docs/transports.md#pino-pretty
  // https://github.com/pinojs/pino-pretty#handling-non-serializable-options
  // transport:
  //   config.logLevel === LogFormat.JSON
  //     ? undefined
  //     : {
  //         target: 'pino-pretty',
  //         options: {
  //           ignore: 'appVersion',
  //           translateTime: 'SYS:HH:MM:ss.l',
  //         },
  //       },
})

export default logger