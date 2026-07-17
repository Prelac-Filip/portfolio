<script setup lang="ts">
const { data: page } = await useAsyncData('projects-page', () => {
  return queryCollection('pages').path('/projects').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects').all()
})

const byCategory = (category: 'Personal' | 'Professional') =>
  (projects.value ?? [])
    .filter(project => project.category === category)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

const personalProjects = computed(() => byCategory('Personal'))
const professionalProjects = computed(() => byCategory('Professional'))

const { global } = useAppConfig()

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Portfolio', { title, description })
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :links="page.links"
      :ui="{
        title: 'mx-0! text-left',
        description: 'mx-0! text-left',
        links: 'justify-start'
      }"
    >
      <template #links>
        <div
          v-if="page.links"
          class="flex items-center gap-2"
        >
          <UButton
            :label="page.links[0]?.label"
            :to="global.meetingLink"
            v-bind="page.links[0]"
          />
          <UButton
            :to="`mailto:${global.email}`"
            v-bind="page.links[1]"
          />
        </div>
      </template>
    </UPageHero>
    <UPageSection
      title="Personal"
      :ui="{
        container: 'pt-0!',
        title: 'text-left text-xl'
      }"
    >
      <ProjectCard
        v-for="(project, index) in personalProjects"
        :key="project.path"
        :project="project"
        :index="index"
      />
    </UPageSection>
    <UPageSection
      title="Professional"
      :ui="{
        title: 'text-left text-xl'
      }"
    >
      <ProjectCard
        v-for="(project, index) in professionalProjects"
        :key="project.path"
        :project="project"
        :index="index"
      />
    </UPageSection>
  </UPage>
</template>
