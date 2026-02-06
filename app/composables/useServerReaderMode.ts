type FrameCheckResponse = {
  iframeLikelyBlocked: boolean;
  status?: number;
  error?: string;
};

type ReaderModeArticle = {
  title?: string;
  byline?: string;
  content?: string;
  originalUrl?: string;
  excerpt?: string;
  siteName?: string;
};

export const useServerReaderMode = () => {
  const checkFrameAccess = (url: string) =>
    $fetch<FrameCheckResponse>('/api/check-frame', {
      query: { url },
    });

  const fetchReaderMode = (url: string) =>
    $fetch<ReaderModeArticle>('/api/reader-mode', {
      query: { url },
    });

  return {
    checkFrameAccess,
    fetchReaderMode,
  };
};
