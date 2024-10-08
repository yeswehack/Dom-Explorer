/* eslint-disable @typescript-eslint/no-explicit-any */

type Imp = (f:string) => Promise<any>
type StrFunc = (imp: Imp, ...args: any[]) => string | Promise<string>;
type GetParams<T> = T extends (imp: Imp, ...args: infer P) => any ? P : never;
interface WaitingForReply {
  resolve: (s: string) => void;
  reject: (s: string) => void;
}

function wrapper(f: StrFunc, sandboxId: string, origin: string, imp: Imp) {
  parent.postMessage({ sandboxId, ready: true }, origin);
  window.addEventListener("message", async (e) => {
    if (e.origin !== origin) return;
    const { args, callId } = e.data;
    try {
      const r = await f(imp, ...args);
      parent.postMessage({ sandboxId, callId, result: `${r}` }, origin);
    } catch (e) {
      parent.postMessage({ sandboxId, callId, error: `${e}` }, origin);
    }
  });
}

export function useSandbox<T extends StrFunc>(f: T) {
  const waitingForFrame = new Set<{ callId: string; args: GetParams<T> }>();
  const waitingForReply = new Map<string, WaitingForReply>();
  const sandboxId = randomId(32);
  let ready = false;

  const frame = document.createElement("iframe");
  frame.style.display = "none";
  frame.setAttribute("sandbox", "allow-scripts allow-modals");

  function callFrame(callId: string, args: GetParams<T>) {
    frame.contentWindow?.postMessage({ args, callId }, "*");
  }

  window.addEventListener("message", ({ data }) => {
    if (data.sandboxId !== sandboxId) return;
    if (data.ready) {
      ready = true;
      waitingForFrame.forEach(({ callId, args }) => callFrame(callId, args));
      waitingForFrame.clear();
      return;
    }
    if (data.callId) {
      if (!waitingForReply.has(data.callId)) return;
      const { resolve, reject } = waitingForReply.get(data.callId)!;
      if (data.error) {
        return reject(data.error);
      } else {
        return resolve(data.result);
      }
    }
  });

  const script = `(${wrapper})((${f}), "${sandboxId}", "${window.location.origin}", s=>import(s))`;
  const url = `data:application/javascript;base64,${btoa(script)}`;
  frame.srcdoc = `<script src="${url}" type="module"></script>`;

  onMounted(() => {
    document.body.appendChild(frame);
  });

  tryOnScopeDispose(() => {
    frame.remove();
  });

  return (...args: GetParams<T>): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const callId = randomId();
      waitingForReply.set(callId, { resolve, reject });
      if (ready) {
        callFrame(callId, args);
        return;
      }
      waitingForFrame.add({ callId, args });
    });
  };
}
