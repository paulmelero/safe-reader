type ViewTransitionLike = {
  finished: Promise<void>;
};

type TransitionCallback = () => void | Promise<void>;

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: TransitionCallback) => ViewTransitionLike;
};

export const runViewTransition = async (callback: TransitionCallback) => {
  if (typeof document === "undefined") {
    await callback();
    return;
  }

  const doc = document as DocumentWithViewTransition;
  if (!doc.startViewTransition) {
    await callback();
    return;
  }

  const transition = doc.startViewTransition(async () => {
    await callback();
  });

  try {
    await transition.finished;
  } catch {
    // Ignore transition failures and continue.
  }
};
