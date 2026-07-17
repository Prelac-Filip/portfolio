<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'

defineProps<{
  project: ProjectsCollectionItem
  index: number
}>()
</script>

<template>
  <Motion
    :initial="{ opacity: 0, transform: 'translateY(10px)' }"
    :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
    :transition="{ delay: 0.2 * index }"
    :in-view-options="{ once: true }"
  >
    <UPageCard
      :title="project.title"
      :description="project.description"
      orientation="horizontal"
      variant="naked"
      :reverse="index % 2 === 1"
      class="group"
      :ui="{
        wrapper: 'max-sm:order-last'
      }"
    >
      <template #leading>
        <span class="text-sm text-muted">
          {{ new Date(project.date).getFullYear() }}
        </span>
      </template>
      <template #footer>
        <div class="flex items-center gap-4">
          <ULink
            :to="project.path"
            class="text-sm text-primary flex items-center"
          >
            View details
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 text-primary transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
            />
          </ULink>
          <ULink
            v-if="project.url !== '#'"
            :to="project.url"
            target="_blank"
            class="text-sm text-muted flex items-center gap-1 hover:text-default"
          >
            Visit site
            <UIcon
              name="i-lucide-external-link"
              class="size-4"
            />
          </ULink>
        </div>
      </template>
      <img
        :src="project.image"
        :alt="project.title"
        class="object-cover w-full h-48 rounded-lg"
      >
    </UPageCard>
  </Motion>
</template>
