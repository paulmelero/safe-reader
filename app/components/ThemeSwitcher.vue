<template>
  <label class="flex cursor-pointer gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <path
        d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
      />
    </svg>
    <input
      type="checkbox"
      value="dark"
      :checked="isDark"
      @change="onThemeChange"
      class="toggle"
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  </label>
</template>

<script setup lang="ts">
// useState keeps both ThemeSwitcher instances (Footer + MobileNav) in sync.
const isDark = useState("theme-is-dark", () => false);

onMounted(() => {
  // The blocking head script already applied the theme from localStorage.
  // Just read what it set so the checkbox matches without a second round-trip.
  const current = document.documentElement.getAttribute("data-theme");
  if (current) {
    isDark.value = current === "dark";
  } else {
    // Fallback: no head script ran (e.g. SSG/static export edge case)
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const theme = saved ?? (prefersDark ? "dark" : "light");
    isDark.value = theme === "dark";
    document.documentElement.setAttribute("data-theme", theme);
  }
});

const onThemeChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const theme = target.checked ? "dark" : "light";
  isDark.value = target.checked;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};
</script>
