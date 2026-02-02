import { computed } from "vue";

interface StaticPageContentOptions {
  titleKey: string;
  titleDefault: string;
  bodyKeys: string[];
  bodyDefaults: string[];
}

export function useStaticPageContent({
  titleKey,
  titleDefault,
  bodyKeys,
  bodyDefaults,
}: StaticPageContentOptions) {
  const { t } = useI18n();

  const title = computed(() => t(titleKey, titleDefault));

  const paragraphs = computed(() =>
    bodyKeys
      .map((key, index) => t(key, bodyDefaults[index] ?? ""))
      .filter((paragraph) => paragraph && paragraph.trim().length > 0),
  );

  return {
    title,
    paragraphs,
  };
}
