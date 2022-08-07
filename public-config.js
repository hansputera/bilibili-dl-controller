export const publicConfig = {
    'ratelimit': {
        'time': 30_000, // 30 seconds
        'max': 50, // 50 requests
        'save_time': 60_000, // 1 minute
    },
    'safeIp': {
        'confidence': 50,
        'reports': 10,
    }
};
