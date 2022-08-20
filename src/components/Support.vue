<template>
  <span>{{ $t("SupportText") }}</span>
  <ul>
    <li>
      {{ $t("OpenSourceText") }}
      <el-link
        type="primary"
        href="https://github.com/ConorSheehan1/beach-litriochta"
        target="_blank">
        GitHub
        <img
          height="36"
          src="../assets/github.svg"
          alt="github"
          class="github-icon" />
      </el-link>
    </li>
    <li>
      {{ $t("KoFiText") }}
      <el-link
        type="primary"
        href="https://ko-fi.com/A0A1DOQQD"
        target="_blank">
        <img
          height="36"
          style="border: 0px; height: 36px"
          src="https://cdn.ko-fi.com/cdn/kofi2.png?v=3"
          border="0"
          alt="Buy Me a Coffee at ko-fi.com" />
      </el-link>
    </li>
  </ul>
</template>

<style scoped lang="scss">
html.dark {
  .github-icon {
    filter: invert(0.8);
  }
}
</style>
