<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageSection
    :title="page.skills.title"
    :description="page.skills.description"
    :ui="{
      container: 'p-0! gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
    }"
  >
    <div class="flex flex-col gap-6">
      <Motion
        v-for="(category, index) in page.skills.categories"
        :key="category.title"
        :initial="{ opacity: 0, transform: 'translateY(20px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.1 * index }"
        :in-view-options="{ once: true }"
      >
        <h3 class="text-xs uppercase tracking-wider text-muted mb-2">
          {{ category.title }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="skill in category.items"
            :key="skill.label"
            :label="skill.label"
            :color="skill.core ? 'primary' : 'neutral'"
            :variant="skill.core ? 'soft' : 'outline'"
            size="lg"
          />
        </div>
      </Motion>
    </div>
  </UPageSection>
</template>
