import { useState, useEffect } from 'react';
import { contentCache } from '../services/contentService';
import { parseGitHubUrl, detectLanguage } from '../utils/githubParser';

interface UseFileContentResult {
  content: string | null;
  language: string;
  loading: boolean;
  error: Error | null;
}

export function useFileContent(
  url: string | undefined,
  cachedContent?: string,
  token?: string
): UseFileContentResult {
  const [state, setState] = useState<UseFileContentResult>({
    content: cachedContent || null,
    language: 'text',
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!url) {
      setState(s => ({ ...s, content: null, loading: false, error: null }));
      return;
    }

    // Determine language immediately from URL
    let language = 'text';
    try {
      const info = parseGitHubUrl(url);
      language = detectLanguage(info.path);
    } catch (e) {
      console.error('[useFileContent] URL parse error:', e);
    }

    // If we have cached content provided via props, use it
    if (cachedContent) {
      setState({
        content: cachedContent,
        language,
        loading: false,
        error: null
      });
      return;
    }

    let mounted = true;
    setState(s => ({ ...s, loading: true, error: null, language }));

    contentCache.fetchContent(url, token)
      .then(content => {
        if (mounted) {
          setState({
            content,
            language,
            loading: false,
            error: null
          });
        }
      })
      .catch(error => {
        if (mounted) {
          console.error('[useFileContent] Fetch error:', error);
          setState({
            content: null,
            language,
            loading: false,
            error
          });
        }
      });

    return () => {
      mounted = false;
    };
  }, [url, cachedContent, token]);

  return state;
}

