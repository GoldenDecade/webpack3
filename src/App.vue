<template>
	<div id="main-page">
    hello ...
		<section class="wrapper">
			<section class="item">1</section>
			<section class="item">2</section>
			<section class="item item3">3</section>
		</section>
	</div>
</template>
<style rel="stylesheet" lang="stylus">
	#main-page
		width: 100%
		height: 100%
		.wrapper
			display flex
			justify-content space-around
			width: 100%
			height: 30px
			.item
				flex 0 0 25%
				background-color: yellow
</style>
<script>
	export default {
		name: 'app',
		created() {
		  let arr = [1, 2, 3]
      // console.log(_.drop(arr, 2));// 相当于slice,默认从索引1开始截取
      console.log(drop(arr, 2));// 相当于slice,默认从索引1开始截取
      console.log(_.concat(arr, 53));
      console.log(arr);
    }
	}

</script>
