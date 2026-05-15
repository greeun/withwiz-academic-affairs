"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }


var _chunkS7GOXCRMjs = require('./chunk-S7GOXCRM.js');


var _chunkFJCSRKGNjs = require('./chunk-FJCSRKGN.js');

// src/hooks/useAdminList.ts
var _react = require('react');
function useAdminList(options) {
  const { initialItems, apiPath, defaultSortKey, normalizeItem, defaultFilterValue } = options;
  const [items, setItems] = _react.useState.call(void 0, initialItems);
  const [searchQuery, setSearchQuery] = _react.useState.call(void 0, "");
  const [sortKey, setSortKey] = _react.useState.call(void 0, defaultSortKey);
  const [filterValue, setFilterValue] = _react.useState.call(void 0, _nullishCoalesce(defaultFilterValue, () => ( "all")));
  const fetchList = _react.useCallback.call(void 0, 
    async (sort) => {
      try {
        const res = await _chunkFJCSRKGNjs.adminFetch.call(void 0, `${apiPath}?limit=100&sortBy=${sort}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setItems(normalizeItem ? json.data.items.map(normalizeItem) : json.data.items);
          }
        }
      } catch (e2) {
      }
    },
    [apiPath, normalizeItem]
  );
  const isInitialMount = _react.useRef.call(void 0, true);
  _react.useEffect.call(void 0, () => {
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

function useAdminForm(initialForm) {
  const [tab, setTab] = _react.useState.call(void 0, "list");
  const [form, setForm] = _react.useState.call(void 0, initialForm);
  const [selectedId, setSelectedId] = _react.useState.call(void 0, null);
  const [isNew, setIsNew] = _react.useState.call(void 0, false);
  const [saving, setSaving] = _react.useState.call(void 0, false);
  const [loading, setLoading] = _react.useState.call(void 0, false);
  const [mobilePv, setMobilePv] = _react.useState.call(void 0, false);
  const updateField = _react.useCallback.call(void 0, (key, value) => {
    setForm((prev) => prev[key] === value ? prev : { ...prev, [key]: value });
  }, []);
  const addNew = _react.useCallback.call(void 0, 
    (emptyForm) => {
      setSelectedId(null);
      setIsNew(true);
      setForm(emptyForm);
      setTab("edit");
    },
    []
  );
  const startEdit = _react.useCallback.call(void 0, (id, emptyForm) => {
    setSelectedId(id);
    if (emptyForm) setForm(emptyForm);
    setIsNew(false);
    setLoading(true);
    setTab("edit");
  }, []);
  const backToList = _react.useCallback.call(void 0, () => {
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

var ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
var MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    const allowed = ALLOWED_TYPES.map((t) => t.split("/")[1]).join(", ");
    return `\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uD30C\uC77C \uD615\uC2DD\uC785\uB2C8\uB2E4. (\uD5C8\uC6A9: ${allowed})`;
  }
  const sizeError = _chunkS7GOXCRMjs.validateImageSize.call(void 0, file);
  if (sizeError) return sizeError;
  return null;
}
async function uploadSingleFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await _chunkFJCSRKGNjs.adminFetch.call(void 0, "/api/admin/upload", {
    method: "POST",
    body: fd
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(_optionalChain([json, 'access', _ => _.error, 'optionalAccess', _2 => _2.message]) || "\uC5C5\uB85C\uB4DC \uC2E4\uD328");
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
  const [isDragOver, setIsDragOver] = _react.useState.call(void 0, false);
  const [isUploading, setIsUploading] = _react.useState.call(void 0, false);
  const [isResizing, setIsResizing] = _react.useState.call(void 0, false);
  const [error, setError] = _react.useState.call(void 0, null);
  const dragCounterRef = _react.useRef.call(void 0, 0);
  const processFiles = _react.useCallback.call(void 0, 
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
          const result = await _chunkS7GOXCRMjs.resizeImageIfNeeded.call(void 0, file);
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
          if (result.key) _optionalChain([onKeyTracked, 'optionalCall', _3 => _3(result.key)]);
          if (result.variantKeys) {
            for (const vk of result.variantKeys) _optionalChain([onKeyTracked, 'optionalCall', _4 => _4(vk)]);
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
  const onDragEnter = _react.useCallback.call(void 0, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (_optionalChain([e, 'access', _5 => _5.dataTransfer, 'optionalAccess', _6 => _6.types, 'access', _7 => _7.includes, 'call', _8 => _8("Files")])) {
      setIsDragOver(true);
    }
  }, []);
  const onDragOver = _react.useCallback.call(void 0, (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const onDragLeave = _react.useCallback.call(void 0, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);
  const onDrop = _react.useCallback.call(void 0, 
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      setIsDragOver(false);
      if (disabled) return;
      const files = Array.from(_optionalChain([e, 'access', _9 => _9.dataTransfer, 'optionalAccess', _10 => _10.files]) || []).filter(
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
  const handleFileInput = _react.useCallback.call(void 0, 
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





exports.useAdminList = useAdminList; exports.useAdminForm = useAdminForm; exports.useImageDropZone = useImageDropZone;
//# sourceMappingURL=chunk-GVEUBO56.js.map