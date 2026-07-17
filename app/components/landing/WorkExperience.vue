<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageSection
    :title="page.experience.title"
    :ui="{
      container: 'p-0! gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'mt-2'
    }"
  >
    <template #description>
      <div class="flex flex-col gap-2">
        <Motion
          v-for="(experience, index) in page.experience.items"
          :key="index"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.4 + 0.2 * index }"
          :in-view-options="{ once: true }"
          class="text-muted flex items-center gap-2"
        >
          <p class="text-sm shrink-0">
            {{ experience.date }}
          </p>
          <USeparator class="shrink min-w-4" />
          <ULink
            class="flex flex-wrap items-center justify-end gap-x-1 min-w-0 text-right"
            :to="experience.company.url"
            target="_blank"
          >
            <span class="text-sm">
              {{ experience.position }}
            </span>
            <UIcon
              :name="experience.company.logo"
              :aria-label="experience.company.name"
              class="text-2xl"
              :style="{ color: experience.company.color }"
            />
          </ULink>
        </Motion>
      </div>
    </template>
  </UPageSection>
</template>

<style scoped>

</style>
