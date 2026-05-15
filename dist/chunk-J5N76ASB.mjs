// src/utils/image-resize.ts
var MAX_DIMENSION = 1920;
var TARGET_SIZE = 4 * 1024 * 1024;
var SKIP_THRESHOLD = 500 * 1024;
var GIF_MAX_SIZE = 5 * 1024 * 1024;
var ABSOLUTE_MAX_SIZE = 50 * 1024 * 1024;
var SKIP_RESIZE_TYPES = ["image/gif"];
async function resizeImageIfNeeded(file) {
  const originalSize = file.size;
  if (SKIP_RESIZE_TYPES.includes(file.type)) {
    return { file, wasResized: false, originalSize, newSize: originalSize };
  }
  const img = await loadImage(file);
  const { width, height } = img;
  const longestEdge = Math.max(width, height);
  if (file.size <= SKIP_THRESHOLD && longestEdge <= MAX_DIMENSION) {
    return { file, wasResized: false, originalSize, newSize: originalSize };
  }
  const outputMime = detectOutputMime(file.type);
  let targetW = width;
  let targetH = height;
  if (longestEdge > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / longestEdge;
    targetW = Math.round(width * scale);
    targetH = Math.round(height * scale);
  }
  const qualitySteps = [0.85, 0.8, 0.75, 0.65, 0.55, 0.5];
  for (const quality of qualitySteps) {
    const blob = await canvasToBlob(img, targetW, targetH, outputMime, quality);
    if (blob.size <= TARGET_SIZE) {
      return toResult(blob, file.name, outputMime, originalSize);
    }
  }
  const scaleSteps = [0.8, 0.65, 0.5, 0.4];
  for (const scale of scaleSteps) {
    const newW = Math.round(targetW * scale);
    const newH = Math.round(targetH * scale);
    const blob = await canvasToBlob(img, newW, newH, outputMime, 0.75);
    if (blob.size <= TARGET_SIZE) {
      return toResult(blob, file.name, outputMime, originalSize);
    }
  }
  const finalW = Math.round(targetW * 0.3);
  const finalH = Math.round(targetH * 0.3);
  const finalBlob = await canvasToBlob(img, finalW, finalH, outputMime, 0.5);
  return toResult(finalBlob, file.name, outputMime, originalSize);
}
function validateImageSize(file) {
  if (file.size > ABSOLUTE_MAX_SIZE) {
    return `\uD30C\uC77C \uD06C\uAE30\uAC00 \uB108\uBB34 \uD07D\uB2C8\uB2E4. (${(file.size / 1024 / 1024).toFixed(0)}MB, \uCD5C\uB300 50MB)`;
  }
  if (SKIP_RESIZE_TYPES.includes(file.type) && file.size > GIF_MAX_SIZE) {
    return `GIF \uD30C\uC77C\uC740 5MB \uC774\uD558\uB9CC \uC5C5\uB85C\uB4DC\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. (${(file.size / 1024 / 1024).toFixed(1)}MB)`;
  }
  return null;
}
function detectOutputMime(inputType) {
  if (typeof document === "undefined") return "image/jpeg";
  const supportsWebP = document.createElement("canvas").toDataURL("image/webp").startsWith("data:image/webp");
  if (supportsWebP) return "image/webp";
  return inputType === "image/png" ? "image/jpeg" : inputType || "image/jpeg";
}
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("\uC774\uBBF8\uC9C0 \uB85C\uB4DC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uD30C\uC77C\uC774 \uC190\uC0C1\uB418\uC5C8\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4."));
    };
    img.src = url;
  });
}
function canvasToBlob(img, width, height, mime, quality) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("\uC774\uBBF8\uC9C0 \uCC98\uB9AC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4."));
      return;
    }
    if (mime !== "image/png") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(img, 0, 0, width, height);
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("\uC774\uBBF8\uC9C0 \uBCC0\uD658\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4."));
      },
      mime,
      quality
    );
  });
}
function toResult(blob, originalName, mime, originalSize) {
  const ext = mime === "image/jpeg" ? ".jpg" : mime === "image/webp" ? ".webp" : ".png";
  const baseName = originalName.replace(/\.[^.]+$/, "");
  const file = new File([blob], `${baseName}${ext}`, { type: mime });
  return { file, wasResized: true, originalSize, newSize: blob.size };
}

export {
  resizeImageIfNeeded,
  validateImageSize
};
//# sourceMappingURL=chunk-J5N76ASB.mjs.map