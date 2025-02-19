<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { Terminal } from 'vue-web-terminal';
import type { DragConfig, FailedFunc, SuccessFunc, TerminalMessageClass } from 'vue-web-terminal';
import TerminalHeader from './terminalHeader/TerminalHeader.vue';
import { useTerminalStore } from '@/stores/modules/terminal/terminal';

const userData = JSON.parse(localStorage.getItem('user') ?? '{}').user ?? null;

const roleUser: string = userData?.roleId ?? 'unknown';

export default defineComponent({
  name: 'TerminalComponent',
  data() {
    return {
      roleUser: roleUser,
    };
  },
  components: {
    TerminalHeader,
    Terminal
  },
  setup() {
    const isLoading = ref(false);
    const dragConf = reactive<DragConfig>({
      width: "50%",
      height: "100%",
      zIndex: 100,
      init: {
        x: 200,
        y: 200
      },
      pinned: false
    });

    const onExecCmd = async(key: string, command: string, success: SuccessFunc, failed: FailedFunc) => {
      if(!isLoading.value) {
        isLoading.value = true;
        const store = useTerminalStore();
        // Get the list of chosen servers
        const choicedServers = store.choicedServers;
        
        if (!choicedServers || choicedServers.length === 0) {
          failed('Không có server được chọn.');
          isLoading.value = false;
          return;
        }
        
        try {
          let allClass = ['success', 'error', 'system', 'info', 'warning'];
          let clazz = allClass[3];
          success({
                type: 'normal',
                class: clazz as TerminalMessageClass,
                tag: clazz,
                content: "Hãy đợi, scripts đang chạy..."
              });
          // Loop through all selected servers
          for (const server of choicedServers) {
            // Call the execCommands function from useTerminalStore
            const result = await store.execCommands({server, command});
            if (result.status) {
              // If the command execution is successful, call the success callback
              clazz = allClass[0];
              
              success({
                type: 'normal',
                class: clazz as TerminalMessageClass,
                tag: clazz,
                content: result.messages
              });
            } else {
              // If the command fails on a particular server, call the failed callback
              failed(result.messages);
            }
          }
        } catch (error) {
          // Catch any unexpected errors
          failed(`Unexpected error: ${error}`);
        } finally {
          // Set loading to false when the command execution is complete
          isLoading.value = false;
        }
      }
    };

    return {
      dragConf,
      onExecCmd,
      isLoading
    };
  }
});
</script>

<template>
  <TerminalHeader />
  <div class="terminal-container">
    <Terminal name="my-terminal"
              theme="dark"
              title="SEO Admin Terminal"
              @exec-cmd="onExecCmd"
              :context="roleUser"
              :disabled="true"
              style="height: 500px;"
    />
  </div>
</template>

<style scoped>
.terminal-container {
  padding-left: 0 !important;
}
</style>