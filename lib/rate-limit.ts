import { NextRequest } from 'next/server';

interface RateLimitConfig {
  interval: number; // in seconds
  limit: number;
}

const defaultConfig: RateLimitConfig = {
  interval: 60, // 1 minute
  limit: 100, // 100 requests per minute
};

// In-memory store for rate limiting (will reset on server restart)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

export async function rateLimit(
  req: NextRequest,
  config: RateLimitConfig = defaultConfig
): Promise<{ success: boolean; limit: number; remaining: number }> {
  // Get IP from headers or fallback to a default
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';

  const now = Date.now();
  const key = `rate-limit:${ip}`;
  const stored = rateLimitStore.get(key);

  if (!stored) {
    // First request from this IP
    rateLimitStore.set(key, {
      count: 1,
      timestamp: now,
    });
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
    };
  }

  // Check if the window has expired
  if (now - stored.timestamp > config.interval * 1000) {
    // Reset the counter
    rateLimitStore.set(key, {
      count: 1,
      timestamp: now,
    });
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
    };
  }

  // Check if limit exceeded
  if (stored.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
    };
  }

  // Increment counter
  stored.count += 1;
  rateLimitStore.set(key, stored);

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - stored.count,
  };
} 