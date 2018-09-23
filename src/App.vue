<template>
	<div>
		hello world
	</div>
</template>
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
