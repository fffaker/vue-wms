<style scoped>
.expand-row {
  margin-bottom: 16px;
}
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col span="24">
        <span class="expand-key">物料信息:</span>
        <br />
        <span
          class="expand-value"
        >{{ row.outMatterDTOS[0].matterCode }} {{row.outMatterDTOS[0].matterName}} {{row.outMatterDTOS[0].matterMarking}} *{{row.outMatterDTOS[0].matterNum}}个</span>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  props: {
    row: Object
  }
};
</script>
