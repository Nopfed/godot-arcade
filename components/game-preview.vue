<template>
  <v-container>
    <h1 v-if="!files">Waiting for game files...</h1>
    <canvas id="canvas"></canvas>
    <div id="status">
      <div
        id="status-progress"
        style="display: none;"
        oncontextmenu="event.preventDefault();"
      >
        <div id="status-progress-inner"></div>
      </div>
      <div
        id="status-indeterminate"
        style="display: none;"
        oncontextmenu="event.preventDefault();"
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div id="status-notice" class="godot" style="display: none;"></div>
    </div>

    <div id="game-js"></div>
  </v-container>
</template>

<script setup lang="ts">
import postscribe from 'postscribe'

type GodotEngineFile = { name: string, size: number, url: string }
type GodotGameFiles = {
  js: GodotEngineFile
  pck: GodotEngineFile
  wasm: GodotEngineFile
  icon: GodotEngineFile
  appleIcon: GodotEngineFile
}
const { files } = defineProps<{
  files: GodotGameFiles | null
}>()

defineOptions({
  mounted() {
    // @ts-expect-error shut up, typescript
    const { files }: { files: GodotGameFiles | null } = this.$props

    // console.log('game preview got files', files)

    if (files?.js) {
      console.log('go postscribe!')
      postscribe('#game-js', `<script src="${files.js.url}"><\/script>`)
    } else {
      console.log('no postscribe :(')
    }
  }
})

const start = () => {
  const GODOT_CONFIG = {
    args: [],
    canvasResizePolicy: 2,
    executable: '2D simple platformer',
    experimentalVK: false,
    fileSizes: {
      '2D simple platformer.pck': 8908528,
      '2D simple platformer.wasm': 17503191
    },
    focusCanvas: true,
    gdnativeLibs: []
  }

  // @ts-expect-error Engine is from the game js source
  const engine = new Engine(GODOT_CONFIG)

  const INDETERMINATE_STATUS_STEP_MS = 100;
  const statusProgress = document.getElementById('status-progress');
  const statusProgressInner = document.getElementById('status-progress-inner');
  const statusIndeterminate = document.getElementById('status-indeterminate');
  const statusNotice = document.getElementById('status-notice');

  if (!statusProgress) { return }

  let initializing = true;
  let statusMode = 'hidden';

  let animationCallbacks: ((ms: number) => void)[] = [];
  function animate(time: number) {
    animationCallbacks.forEach(callback => callback(time));
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  function setStatusMode(mode: string) {
    if (
      statusMode === mode
      || !initializing
      || !statusProgress
      || !statusIndeterminate
      || !statusNotice
    ) { return }
      
    [statusProgress, statusIndeterminate, statusNotice].forEach(elem => {
      elem.style.display = 'none';
    });
    animationCallbacks = animationCallbacks.filter(function(value) {
      return (value != animateStatusIndeterminate);
    });
    switch (mode) {
      case 'progress':
        statusProgress.style.display = 'block';
        break;
      case 'indeterminate':
        statusIndeterminate.style.display = 'block';
        animationCallbacks.push(animateStatusIndeterminate);
        break;
      case 'notice':
        statusNotice.style.display = 'block';
        break;
      case 'hidden':
        break;
      default:
        throw new Error('Invalid status mode');
    }
    statusMode = mode;
  }

  function animateStatusIndeterminate(ms: number) {
    if (!statusIndeterminate) { return }

    var i = Math.floor(ms / INDETERMINATE_STATUS_STEP_MS % 8);
    const borderTopColor = (statusIndeterminate.children[i] as HTMLElement)
      .style
      .borderTopColor
    if (borderTopColor == '') {
      Array.prototype.slice
        .call(statusIndeterminate.children)
        .forEach(child => {
          child.style.borderTopColor = '';
        });

      (statusIndeterminate.children[i] as HTMLElement)
        .style
        .borderTopColor = '#dfdfdf';
    }
  }

  function setStatusNotice(text: string) {
    if (!statusNotice) { return }

    while (statusNotice.lastChild) {
      statusNotice.removeChild(statusNotice.lastChild);
    }
    var lines = text.split('\n');
    lines.forEach((line) => {
      statusNotice.appendChild(document.createTextNode(line));
      statusNotice.appendChild(document.createElement('br'));
    });
  };

  function displayFailureNotice(err: Error | string) {
    var msg = err instanceof Error ? err.message : err;
    console.error(msg);
    setStatusNotice(msg);
    setStatusMode('notice');
    initializing = false;
  };

  // @ts-expect-error Engine is from game js
  if (!Engine.isWebGLAvailable()) {
    displayFailureNotice('WebGL not available');
  } else {
    setStatusMode('indeterminate');
    engine.startGame({
      'onProgress': function (current: number, total: number) {
        if (!statusProgressInner) { return }

        if (total > 0) {
          statusProgressInner.style.width = current/total * 100 + '%';
          setStatusMode('progress');
          if (current === total) {
            // wait for progress bar animation
            setTimeout(() => {
              setStatusMode('indeterminate');
            }, 500);
          }
        } else {
          setStatusMode('indeterminate');
        }
      },
    }).then(() => {
      setStatusMode('hidden');
      initializing = false;
    }, displayFailureNotice);
  }
}

if (files) { start() }
</script>
