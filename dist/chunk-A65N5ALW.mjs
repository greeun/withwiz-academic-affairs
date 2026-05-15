import {
  resizeImageIfNeeded,
  validateImageSize
} from "./chunk-J5N76ASB.mjs";
import {
  adminFetch
} from "./chunk-L55N6LYP.mjs";

// src/hooks/useAdminList.ts
import { useState, useCallback, useRef, useEffect } from "react";
function useAdminList(options) {
  const { initialItems, apiPath, defaultSortKey, normalizeItem, defaultFilterValue } = options;
  const [items, setItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [filterValue, setFilterValue] = useState(defaultFilterValue ?? "all");
  const fetchList = useCallback(
    async (sort) => {
      try {
        const res = await adminFetch(`${apiPath}?limit=100&sortBy=${sort}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setItems(normalizeItem ? json.data.items.map(normalizeItem) : json.data.items);
          }
        }
      } catch {
      }
    },
    [apiPath, normalizeItem]
  );
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchList(sortKey);
  }, [sortKey, fetchList]);
  return {
    items,
    setItems,
    searchQuery,
    setSearchQuery,
    sortKey,
    setSortKey,
    filterValue,
    setFilterValue,
    fetchList
  };
}

// src/hooks/useAdminForm.ts
import { useState as useState2, useCallback as useCallback2 } from "react";
function useAdminForm(initialForm) {
  const [tab, setTab] = useState2("list");
  const [form, setForm] = useState2(initialForm);
  const [selectedId, setSelectedId] = useState2(null);
  const [isNew, setIsNew] = useState2(false);
  const [saving, setSaving] = useState2(false);
  const [loading, setLoading] = useState2(false);
  const [mobilePv, setMobilePv] = useState2(false);
  const updateField = useCallback2((key, value) => {
    setForm((prev) => prev[key] === value ? prev : { ...prev, [key]: value });
  }, []);
  const addNew = useCallback2(
    (emptyForm) => {
      setSelectedId(null);
      setIsNew(true);
      setForm(emptyForm);
      setTab("edit");
    },
    []
  );
  const startEdit = useCallback2((id, emptyForm) => {
    setSelectedId(id);
    if (emptyForm) setForm(emptyForm);
    setIsNew(false);
    setLoading(true);
    setTab("edit");
  }, []);
  const backToList = useCallback2(() => {
    setTab("list");
    setSelectedId(null);
  }, []);
  return {
    tab,
    setTab,
    form,
    setForm,
    updateField,
    selectedId,
    setSelectedId,
    isNew,
    setIsNew,
    saving,
    setSaving,
    loading,
    setLoading,
    mobilePv,
    setMobilePv,
    addNew,
    startEdit,
    backToList
  };
}

// src/hooks/useImageDropZone.ts
import { useState as useState3, useCallback as useCallback3, useRef as useRef2 } from "react";
var ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
var MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    const allowed = ALLOWED_TYPES.map((t) => t.split("/")[1]).join(", ");
    return `\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uD30C\uC77C \uD615\uC2DD\uC785\uB2C8\uB2E4. (\uD5C8\uC6A9: ${allowed})`;
  }
  const sizeError = validateImageSize(file);
  if (sizeError) return sizeError;
  return null;
}
async function uploadSingleFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await adminFetch("/api/admin/upload", {
    method: "POST",
    body: fd
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error?.message || "\uC5C5\uB85C\uB4DC \uC2E4\uD328");
  }
  return json.data;
}
function useImageDropZone(options) {
  const {
    multiple = false,
    maxFiles,
    onUpload,
    onKeyTracked,
    disabled = false
  } = options;
  const [isDragOver, setIsDragOver] = useState3(false);
  const [isUploading, setIsUploading] = useState3(false);
  const [isResizing, setIsResizing] = useState3(false);
  const [error, setError] = useState3(null);
  const dragCounterRef = useRef2(0);
  const processFiles = useCallback3(
    async (files) => {
      if (disabled || files.length === 0) return;
      let toProcess = multiple ? files : [files[0]];
      if (maxFiles && toProcess.length > maxFiles) {
        toProcess = toProcess.slice(0, maxFiles);
        setError(`\uCD5C\uB300 ${maxFiles}\uAC1C\uAE4C\uC9C0 \uC5C5\uB85C\uB4DC\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.`);
      }
      for (const file of toProcess) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }
      }
      setError(null);
      setIsResizing(true);
      let resizedFiles;
      try {
        resizedFiles = [];
        for (const file of toProcess) {
          const result = await resizeImageIfNeeded(file);
          if (result.wasResized && process.env.NODE_ENV === "development") {
            console.log(
              `[image-optimize] ${(result.originalSize / 1024 / 1024).toFixed(1)}MB \u2192 ${(result.newSize / 1024 / 1024).toFixed(1)}MB`
            );
          }
          if (result.file.size > MAX_UPLOAD_SIZE) {
            setError(
              `\uC774\uBBF8\uC9C0 \uCD5C\uC801\uD654 \uD6C4\uC5D0\uB3C4 5MB\uB97C \uCD08\uACFC\uD569\uB2C8\uB2E4. (${(result.file.size / 1024 / 1024).toFixed(1)}MB) \uB354 \uC791\uC740 \uC774\uBBF8\uC9C0\uB97C \uC0AC\uC6A9\uD574 \uC8FC\uC138\uC694.`
            );
            setIsResizing(false);
            return;
          }
          resizedFiles.push(result.file);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "\uC774\uBBF8\uC9C0 \uCD5C\uC801\uD654 \uC911 \uC624\uB958 \uBC1C\uC0DD";
        setError(msg);
        setIsResizing(false);
        return;
      }
      setIsResizing(false);
      setIsUploading(true);
      try {
        for (const file of resizedFiles) {
          const result = await uploadSingleFile(file);
          onUpload(result);
          if (result.key) onKeyTracked?.(result.key);
          if (result.variantKeys) {
            for (const vk of result.variantKeys) onKeyTracked?.(vk);
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "\uC5C5\uB85C\uB4DC \uC911 \uC624\uB958 \uBC1C\uC0DD";
        setError(msg);
      } finally {
        setIsUploading(false);
      }
    },
    [multiple, maxFiles, onUpload, onKeyTracked, disabled]
  );
  const onDragEnter = useCallback3((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer?.types.includes("Files")) {
      setIsDragOver(true);
    }
  }, []);
  const onDragOver = useCallback3((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const onDragLeave = useCallback3((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);
  const onDrop = useCallback3(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      setIsDragOver(false);
      if (disabled) return;
      const files = Array.from(e.dataTransfer?.files || []).filter(
        (f) => f.type.startsWith("image/")
      );
      if (files.length === 0) {
        setError("\uC774\uBBF8\uC9C0 \uD30C\uC77C\uB9CC \uC5C5\uB85C\uB4DC\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
        return;
      }
      processFiles(files);
    },
    [processFiles, disabled]
  );
  const handleFileInput = useCallback3(
    async (fileList) => {
      const files = Array.from(fileList || []);
      if (files.length > 0) {
        await processFiles(files);
      }
    },
    [processFiles]
  );
  return {
    isDragOver,
    isUploading,
    isResizing,
    error,
    dragHandlers: { onDragEnter, onDragOver, onDragLeave, onDrop },
    handleFileInput
  };
}

export {
  useAdminList,
  useAdminForm,
  useImageDropZone
};
//# sourceMappingURL=chunk-A65N5ALW.mjs.map