<template>
  <div>
    <h1>{{ $t('test.titles.title_a') }}</h1>
    <h2>{{ $t('test.titles.title_b') }}</h2>
    <h3>{{ $t('test.titles.title_c') }}</h3>
    <p>{{ $t('test.paragraphs.p_a') }}</p>
    <p>{{ $t('test.paragraphs.p_b') }}</p>
    <p>{{ $t('test.paragraphs.p_c') }}</p>
    <p v-t="'test.paragraphs.p_d'"></p>
  </div>
</template>

<script>
export default {
  name: 'test',
  data () {
    return {
      a: this.$t('data.example.one'),
      b: this.$t('data.example.two'),
      c: this.$t('data.example.three'),
    }
  }
}
</script>
