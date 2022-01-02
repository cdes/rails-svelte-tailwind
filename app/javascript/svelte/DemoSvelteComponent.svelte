<script lang="ts">
  import { onMount } from "svelte";

  export let argName: string;

  onMount(() => {
    if (argName === undefined) {
      argName = "General Kenobi";
    }
  });
</script>

<!--  -->
<h1 class="italic text-red-700 m-[50px]">Hello there, {argName}!</h1>
