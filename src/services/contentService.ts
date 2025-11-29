import { GitHubFileInfo } from '../types';
import { parseGitHubUrl, toRawGitHubUrl } from '../utils/githubParser';

interface CacheEntry {
  content: string;
  timestamp: number;
}

class ContentCacheService {
  private static instance: ContentCacheService;
  private cache: Map<string, CacheEntry>;
  private pendingRequests: Map<string, Promise<string>>;
  private readonly TTL = 1000 * 60 * 60; // 1 hour

  private constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  static getInstance(): ContentCacheService {
    if (!ContentCacheService.instance) {
      ContentCacheService.instance = new ContentCacheService();
    }
    return ContentCacheService.instance;
  }

  async fetchContent(url: string, token?: string): Promise<string> {
    // Check cache
    const cached = this.cache.get(url);
    if (cached) {
      if (Date.now() - cached.timestamp < this.TTL) {
        return cached.content;
      }
      this.cache.delete(url);
    }

    // Dedup requests
    if (this.pendingRequests.has(url)) {
      return this.pendingRequests.get(url)!;
    }

    const requestPromise = this.performFetch(url, token)
      .then((content) => {
        this.cache.set(url, {
          content,
          timestamp: Date.now(),
        });
        this.pendingRequests.delete(url);
        return content;
      })
      .catch((err) => {
        this.pendingRequests.delete(url);
        // Log error as per user rules, don't just throw
        console.error(`[ContentCache] Failed to fetch ${url}:`, err);
        throw err;
      });

    this.pendingRequests.set(url, requestPromise);
    return requestPromise;
  }

  private async performFetch(url: string, token?: string): Promise<string> {
    const info = parseGitHubUrl(url);

    // Try API first if token provided (higher rate limits)
    if (token) {
      try {
        return await this.fetchViaApi(info, token);
      } catch (err) {
        console.error('[ContentCache] API fetch failed, falling back to raw:', err);
      }
    }

    return await this.fetchViaRaw(info);
  }

  private async fetchViaRaw(info: GitHubFileInfo): Promise<string> {
    const rawUrl = toRawGitHubUrl(info);
    const response = await fetch(rawUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch raw content: ${response.status} ${response.statusText}`);
    }

    return response.text();
  }

  private async fetchViaApi(info: GitHubFileInfo, token: string): Promise<string> {
    const apiUrl = `https://api.github.com/repos/${info.owner}/${info.repo}/contents/${info.path}?ref=${info.ref}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3.raw'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.text();
  }
}

export const contentCache = ContentCacheService.getInstance();

