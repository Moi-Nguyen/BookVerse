const util = require('util');

const COLORS = {
    reset: '\x1b[0m',
    debug: '\x1b[90m',
    info: '\x1b[36m',
    success: '\x1b[32m',
    http: '\x1b[35m',
    warn: '\x1b[33m',
    error: '\x1b[31m'
};

const LABELS = {
    debug: 'DEBUG',
    info: 'INFO ',
    success: 'DONE ',
    http: 'HTTP ',
    warn: 'WARN ',
    error: 'ERROR'
};

const LEVEL_WEIGHT = {
    debug: 10,
    info: 20,
    success: 20,
    http: 20,
    warn: 30,
    error: 40,
    silent: 100
};

const nativeConsole = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console)
};

const configuredLevel = (process.env.LOG_LEVEL || 'info').toLowerCase();
const activeWeight = LEVEL_WEIGHT[configuredLevel] ?? LEVEL_WEIGHT.info;
let consolePatched = false;

function shouldLog(level) {
    const weight = LEVEL_WEIGHT[level] ?? LEVEL_WEIGHT.info;
    return weight >= activeWeight;
}

function formatMeta(meta) {
    if (meta === undefined || meta === null) {
        return '';
    }

    if (meta instanceof Error) {
        return ` | ${meta.message}`;
    }

    if (typeof meta === 'string') {
        return ` | ${meta}`;
    }

    if (typeof meta === 'object') {
        try {
            return ` | ${JSON.stringify(meta)}`;
        } catch (error) {
            return ` | [unserializable-meta]`;
        }
    }

    return ` | ${meta}`;
}

function log(level, message, meta) {
    if (!shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const color = COLORS[level] || COLORS.info;
    const label = LABELS[level] || level.toUpperCase();
    const normalizedMessage = typeof message === 'string' ? message : util.format('%o', message);
    const formatted = `${color}[${timestamp}] ${label} ${normalizedMessage}${formatMeta(meta)}${COLORS.reset}`;

    if (level === 'error') {
        nativeConsole.error(formatted);
    } else if (level === 'warn') {
        nativeConsole.warn(formatted);
    } else {
        nativeConsole.log(formatted);
    }
}

const logger = {
    debug: (message, meta) => log('debug', message, meta),
    info: (message, meta) => log('info', message, meta),
    success: (message, meta) => log('success', message, meta),
    warn: (message, meta) => log('warn', message, meta),
    error: (message, meta) => log('error', message, meta),
    http: (message, meta) => log('http', message, meta),
    bindConsole() {
        if (consolePatched) return;
        consolePatched = true;

        console.log = (...args) => logger.debug(util.format(...args));
        console.info = (...args) => logger.info(util.format(...args));
        console.warn = (...args) => logger.warn(util.format(...args));
        console.error = (...args) => logger.error(util.format(...args));
    }
};

module.exports = logger;

