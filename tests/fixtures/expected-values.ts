export const expectedFromParsedVueFiles = [
  {
    path: 'header.title',
    file: '/tests/fixtures/vue-files/Basic.vue',
    line: 3
  },
  {
    path: 'content.paragraph.p_1',
    file: '/tests/fixtures/vue-files/Basic.vue',
    line: 4
  },
  {
    path: 'Key used as default translation.',
    file: '/tests/fixtures/vue-files/Basic.vue',
    line: 5
  },
  {
    path: 'content.paragraph.p.2',
    file: '/tests/fixtures/vue-files/Basic.vue',
    line: 6
  },
  {
    path: 'content.link.b',
    file: '/tests/fixtures/vue-files/Basic.vue',
    line: 8
  },
  {
    path: 'header.title',
    file: '/tests/fixtures/vue-files/Basic.vue',
    line: 11
  },
  {
    path: 'content.link.a',
    file: '/tests/fixtures/vue-files/Basic.vue',
    line: 7
  },
  {
    path: 'header.title',
    file: '/tests/fixtures/vue-files/Basic.vue',
    line: 10
  },
  {
    path: "single \\' quote",
    file: '/tests/fixtures/vue-files/edge-cases.js',
    line: 2
  },
  {
    path: 'single \\" quote',
    file: '/tests/fixtures/vue-files/edge-cases.js',
    line: 3
  },
  {
    path: 'back \\` tick',
    file: '/tests/fixtures/vue-files/edge-cases.js',
    line: 4
  },
  {
    path: 'Early ',
    file: '/tests/fixtures/vue-files/edge-cases.js',
    line: 5
  },
  {
    path: 'header.title',
    file: '/tests/fixtures/vue-files/folder1/folder2/Deep.vue',
    line: 2
  },
  {
    path: 'header.title',
    file: '/tests/fixtures/vue-files/folder1/Nested.vue',
    line: 2
  },
  {
    path: 'header.title',
    file: '/tests/fixtures/vue-files/InCode.vue',
    line: 8
  },
  {
    path: 'header.title',
    file: '/tests/fixtures/vue-files/InCode.vue',
    line: 14
  },
  {
    path: 'header.title',
    file: '/tests/fixtures/vue-files/InCode.vue',
    line: 31
  },
  {
    path: 'content.paragraph.p_1',
    file: '/tests/fixtures/vue-files/InCode.vue',
    line: 32
  },
  {
    path: 'content.paragraph.p.2',
    file: '/tests/fixtures/vue-files/InCode.vue',
    line: 33
  },
  {
    path: 'header.paragraphs.p_1',
    file: '/tests/fixtures/vue-files/js-component.js',
    line: 2
  },
  {
    path: 'missing.english',
    file: '/tests/fixtures/vue-files/Missing.vue',
    line: 3
  },
  {
    path: 'missing.german',
    file: '/tests/fixtures/vue-files/Missing.vue',
    line: 4
  }
];

export const expectedFromParsedLanguageFiles = {
  de_DE: [
    {
      path: 'header.title',
      file: '/tests/fixtures/lang/de_DE.js',
      line: 0
    },
    {
      path: 'content.paragraph.p.2',
      file: '/tests/fixtures/lang/de_DE.js',
      line: 1
    },
    {
      path: 'content.link.a',
      file: '/tests/fixtures/lang/de_DE.js',
      line: 2
    },
    {
      path: 'content.link.b',
      file: '/tests/fixtures/lang/de_DE.js',
      line: 3
    },
    {
      path: 'Key used as default translation.',
      file: '/tests/fixtures/lang/de_DE.js',
      line: 4
    },
    {
      path: 'missing.english',
      file: '/tests/fixtures/lang/de_DE.js',
      line: 5
    },
    {
      path: 'unused_js',
      file: '/tests/fixtures/lang/de_DE.js',
      line: 6
    },
    {
      path: 'content.paragraph.p_1',
      file: '/tests/fixtures/lang/de_DE.yaml',
      line: 0
    },
    {
      path: 'unused_yaml',
      file: '/tests/fixtures/lang/de_DE.yaml',
      line: 1
    }
  ],
  en_EN: [
    {
      path: 'header.title',
      file: '/tests/fixtures/lang/en_EN.json',
      line: 0
    },
    {
      path: 'content.paragraph.p_1',
      file: '/tests/fixtures/lang/en_EN.json',
      line: 1
    },
    {
      path: 'content.paragraph.p.2',
      file: '/tests/fixtures/lang/en_EN.json',
      line: 2
    },
    {
      path: 'content.link.a',
      file: '/tests/fixtures/lang/en_EN.json',
      line: 3
    },
    {
      path: 'content.link.b',
      file: '/tests/fixtures/lang/en_EN.json',
      line: 4
    },
    {
      path: 'Key used as default translation.',
      file: '/tests/fixtures/lang/en_EN.json',
      line: 5
    },
    {
      path: 'missing.german',
      file: '/tests/fixtures/lang/en_EN.json',
      line: 6
    },
    {
      path: 'unused_json',
      file: '/tests/fixtures/lang/en_EN.json',
      line: 7
    }
  ]
};

export const expectedI18NReport = {
  missingKeys: [
    {
      path: "single \\' quote",
      file: '/tests/fixtures/vue-files/edge-cases.js',
      line: 2,
      language: 'de_DE'
    },
    {
      path: 'single \\" quote',
      file: '/tests/fixtures/vue-files/edge-cases.js',
      line: 3,
      language: 'de_DE'
    },
    {
      path: 'back \\` tick',
      file: '/tests/fixtures/vue-files/edge-cases.js',
      line: 4,
      language: 'de_DE'
    },
    {
      path: 'Early ',
      file: '/tests/fixtures/vue-files/edge-cases.js',
      line: 5,
      language: 'de_DE'
    },
    {
      path: 'header.paragraphs.p_1',
      file: '/tests/fixtures/vue-files/js-component.js',
      line: 2,
      language: 'de_DE'
    },
    {
      path: 'missing.german',
      file: '/tests/fixtures/vue-files/Missing.vue',
      line: 4,
      language: 'de_DE'
    },
    {
      path: "single \\' quote",
      file: '/tests/fixtures/vue-files/edge-cases.js',
      line: 2,
      language: 'en_EN'
    },
    {
      path: 'single \\" quote',
      file: '/tests/fixtures/vue-files/edge-cases.js',
      line: 3,
      language: 'en_EN'
    },
    {
      path: 'back \\` tick',
      file: '/tests/fixtures/vue-files/edge-cases.js',
      line: 4,
      language: 'en_EN'
    },
    {
      path: 'Early ',
      file: '/tests/fixtures/vue-files/edge-cases.js',
      line: 5,
      language: 'en_EN'
    },
    {
      path: 'header.paragraphs.p_1',
      file: '/tests/fixtures/vue-files/js-component.js',
      line: 2,
      language: 'en_EN'
    },
    {
      path: 'missing.english',
      file: '/tests/fixtures/vue-files/Missing.vue',
      line: 3,
      language: 'en_EN'
    }
  ],
  unusedKeys: [
    {
      path: 'unused_js',
      file: '/tests/fixtures/lang/de_DE.js',
      line: 6,
      language: 'de_DE'
    },
    {
      path: 'unused_yaml',
      file: '/tests/fixtures/lang/de_DE.yaml',
      line: 1,
      language: 'de_DE'
    },
    {
      path: 'unused_json',
      file: '/tests/fixtures/lang/en_EN.json',
      line: 7,
      language: 'en_EN'
    }
  ]
}
