<template>
  <div id="christmas-tree" class="christmas-tree">
    <!-- 圣诞树 -->
    <div class="tree">
      <div class="star"></div>
      <div class="layer layer1"></div>
      <div class="layer layer2"></div>
      <div class="layer layer3"></div>
      <div class="layer layer4"></div>
      <div class="layer layer5"></div>
    </div>
    <!-- 雪花 -->
    <div class="snowflakes">
      <span class="snowflake">*</span>
      <span class="snowflake">*</span>
      <span class="snowflake">*</span>
      <span class="snowflake">*</span>
      <span class="snowflake">*</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChristmasTree",
};
</script>

<style scoped>
.christmas-tree {
  position: relative;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: #001f3f; /* 背景颜色 */
}

.tree {
  position: relative;
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid green;
  margin-top: 10px;
}

.tree .star {
  position: absolute;
  top: -20px;
  left: -10px;
  width: 20px;
  height: 20px;
  background: yellow;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

.tree .layer {
  position: absolute;
  background-color: green;
  left: -10px;
  border-radius: 3px;
}

.tree .layer1 {
  top: 30px;
  width: 70px;
  height: 10px;
}

.tree .layer2 {
  top: 50px;
  width: 90px;
  height: 10px;
}

.tree .layer3 {
  top: 70px;
  width: 110px;
  height: 10px;
}

.tree .layer4 {
  top: 90px;
  width: 130px;
  height: 10px;
}

.tree .layer5 {
  top: 110px;
  width: 150px;
  height: 10px;
}

.snowflakes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.snowflake {
  position: absolute;
  color: white;
  font-size: 1rem;
  animation: fall 4s linear infinite;
}

@keyframes fall {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

.snowflake:nth-child(1) {
  left: 10%;
  animation-delay: 0s;
}

.snowflake:nth-child(2) {
  left: 30%;
  animation-delay: 1s;
}

.snowflake:nth-child(3) {
  left: 50%;
  animation-delay: 2s;
}

.snowflake:nth-child(4) {
  left: 70%;
  animation-delay: 3s;
}

.snowflake:nth-child(5) {
  left: 90%;
  animation-delay: 4s;
}
</style>
