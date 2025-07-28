<template>
  <footer class="flex justify-between px-4 py-2">
    <div class="text-gray-600 text-center text-sm">
      <p>
        &copy; {{ new Date().getFullYear() }} SAFEReader. All rights reserved.
      </p>
    </div>
    <nav>
      <ul class="flex space-x-4">
        <li>
          <NuxtLink to="/">Home</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about">About</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/terms">Terms of Service</NuxtLink>
        </li>
      </ul>
    </nav>
  </footer>
</template>
