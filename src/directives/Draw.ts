import { Directive, DirectiveBinding } from "vue";

// MOUSE EVENTS
const drawDot = (
  e: MouseEvent,
  painting: boolean,
  ctx: CanvasRenderingContext2D | null,
  size?: number
) => {
  if (!painting) return;
  if (ctx !== null) {
    ctx.lineWidth = size ? size : 10;
    ctx.lineCap = "round";

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  }
};

const startPosition = (
  e: MouseEvent,
  painting: boolean,
  ctx: CanvasRenderingContext2D | null,
  size?: number
) => {
  painting = true;
  drawDot(e, painting, ctx, size);
  return painting;
};

const finishedPosition = (
  painting: boolean,
  ctx: CanvasRenderingContext2D | null
) => {
  painting = false;
  if (ctx !== null) {
    ctx.beginPath();
  }
  return painting;
};

// UTILITIES FOR TOUCH EVENTS
const copyTouch = ({ identifier, pageX, pageY }: any) => {
  return { identifier, pageX, pageY };
};

const ongoingTouchIndexById = (idToFind: number, ongoingTouches: any[]) => {
  for (let i = 0; i < ongoingTouches.length; i++) {
    const id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1; // not found
};

// TOUCH EVENTS
const touchstart = (
  e: TouchEvent,
  ongoingTouches: any[],
  ctx: CanvasRenderingContext2D | null
) => {
  e.preventDefault();
  const touches = e.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    ongoingTouches.push(copyTouch(touches[i]));
    if (ctx !== null) {
      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.fillStyle = "black";
      ctx.fill();
    }
  }
};

const touchend = (
  e: TouchEvent,
  ongoingTouches: any[],
  ctx: CanvasRenderingContext2D | null,
  size: number
) => {
  e.preventDefault();
  const touches = e.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    const idx = ongoingTouchIndexById(touches[i].identifier, ongoingTouches);

    if (idx >= 0 && ctx !== null) {
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.lineWidth = size;
      ctx.strokeStyle = "black";
      ctx.stroke();
      ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
    }
  }
};

const touchmove = (
  e: any,
  ongoingTouches: any[],
  ctx: CanvasRenderingContext2D | null,
  size: number
) => {
  e.preventDefault();
  const touches = e.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    const idx = ongoingTouchIndexById(touches[i].identifier, ongoingTouches);

    if (idx >= 0 && ctx !== null) {
      ctx.lineCap = "round";
      ctx.lineWidth = size;
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ongoingTouches.splice(idx, 1); // remove it; we're done
    }
  }
};

// THE DIRECTIVE

const drawable: Directive = {
  beforeMount(
    canvas: HTMLCanvasElement,
    binding: DirectiveBinding<{ size: number }>,
    vnode
  ) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    let painting = false;
    const ongoingTouches: any[] = [];

    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

    canvas.addEventListener("mousedown", (e: MouseEvent) => {
      painting = startPosition(
        e,
        painting,
        ctx,
        (binding.instance as any).size
      );
    });
    canvas.addEventListener("mouseup", () => {
      painting = finishedPosition(painting, ctx);
    });
    canvas.addEventListener("mousemove", (e: MouseEvent) =>
      drawDot(e, painting, ctx, (binding.instance as any).size)
    );

    canvas.addEventListener("touchstart", (e: TouchEvent) =>
      touchstart(e, ongoingTouches, ctx)
    );
    canvas.addEventListener("touchend", (e: TouchEvent) =>
      touchend(e, ongoingTouches, ctx, (binding.instance as any).size)
    );
    canvas.addEventListener("touchmove", (e: TouchEvent) =>
      touchmove(e, ongoingTouches, ctx, (binding.instance as any).size)
    );
  },
};

export default drawable;
