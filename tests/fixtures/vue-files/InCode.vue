<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'ex3',
  data () {
    return {
      translation: $t('header.title'),
    }
  },
  setup () {
    const { t, tc } = useI18n();

    const title = t('header.title');

    return {
      t,
      tc,
      title,
    }
  }
}
</script>

<template>
  <div>
    <h1>{{ title }}</h1>

    <p>{{ translation }}</p>

    <p>{{ t('header.title') }}</p>
    <p>{{ t("content.paragraph.p_1", { count: "two" }) }}</p>
    <p>{{ tc(`content.paragraph.p.2`, 2) }}</p>
  </div>
</template>
