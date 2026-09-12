"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }



var _chunkHHGHLX5Jjs = require('./chunk-HHGHLX5J.js');


var _chunkRKWWRCLNjs = require('./chunk-RKWWRCLN.js');

// src/components/AdminManagerBase.tsx
var _react = require('react');
var _reactvirtual = require('@tanstack/react-virtual');
var _sonner = require('sonner');
var _jsxruntime = require('react/jsx-runtime');
function AdminManagerBaseInner({
  initialItems,
  config,
  initialSelectedId,
  startWithNew,
  defaultFilterValue,
  innerRef
}) {
  const list = _chunkHHGHLX5Jjs.useAdminList.call(void 0, {
    initialItems,
    apiPath: config.apiPath,
    defaultSortKey: config.defaultSortKey,
    normalizeItem: config.normalizeListItem,
    defaultFilterValue
  });
  const {
    items,
    setItems,
    searchQuery,
    setSearchQuery,
    sortKey,
    setSortKey,
    filterValue,
    setFilterValue
  } = list;
  const adminForm = _chunkHHGHLX5Jjs.useAdminForm.call(void 0, config.emptyForm);
  const {
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
    startEdit
  } = adminForm;
  _react.useEffect.call(void 0, () => {
    if (startWithNew) {
      handleAdd();
      return;
    }
    if (initialSelectedId) {
      selectItem(initialSelectedId);
    }
  }, []);
  const filteredItems = _react.useMemo.call(void 0, 
    () => config.filterItems(items, filterValue, searchQuery),
    [items, filterValue, searchQuery, config]
  );
  const publishedItems = _react.useMemo.call(void 0, 
    () => items.filter(config.meta.getItemPublished),
    [items, config]
  );
  const selectItem = _react.useCallback.call(void 0, async (id) => {
    startEdit(id, config.emptyForm);
    try {
      const res = await _chunkRKWWRCLNjs.adminFetch.call(void 0, `${config.apiPath}/${id}`);
      const json = await res.json();
      if (json.success) {
        setForm(config.loadItem(json.data));
      } else {
        _sonner.toast.error(_optionalChain([json, 'access', _ => _.error, 'optionalAccess', _2 => _2.message]) || "\uB370\uC774\uD130 \uB85C\uB4DC \uC2E4\uD328");
      }
    } catch (e2) {
      _sonner.toast.error("\uB370\uC774\uD130 \uB85C\uB4DC \uC2E4\uD328");
    } finally {
      setLoading(false);
    }
  }, [config.apiPath, config.loadItem, config.emptyForm]);
  _react.useImperativeHandle.call(void 0, innerRef, () => ({ selectItem }), [selectItem]);
  const handleAdd = _react.useCallback.call(void 0, () => {
    addNew(config.emptyForm);
  }, [config.emptyForm]);
  async function handleSave() {
    const err = config.validate(form);
    if (err) {
      _sonner.toast.error(err);
      return;
    }
    const payload = config.buildSavePayload(form, { isNew, selectedId, items });
    const url = isNew ? config.apiPath : `${config.apiPath}/${selectedId}`;
    const method = isNew ? "POST" : "PUT";
    setSaving(true);
    try {
      const res = await _chunkRKWWRCLNjs.adminFetch.call(void 0, url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        const listRes = await _chunkRKWWRCLNjs.adminFetch.call(void 0, `${config.apiPath}?limit=100&sortBy=${sortKey}`);
        const listJson = await listRes.json();
        if (listJson.success) {
          setItems(listJson.data.items.map(config.normalizeListItem));
        }
        setTab("list");
        setSelectedId(null);
        _sonner.toast.success("\uC800\uC7A5 \uC644\uB8CC");
        _optionalChain([config, 'access', _3 => _3.onAfterSave, 'optionalCall', _4 => _4()]);
        _optionalChain([config, 'access', _5 => _5.onNavigateToList, 'optionalCall', _6 => _6()]);
      } else {
        _sonner.toast.error(_optionalChain([json, 'access', _7 => _7.error, 'optionalAccess', _8 => _8.message]) || "\uC800\uC7A5 \uC2E4\uD328");
      }
    } catch (e3) {
      _sonner.toast.error("\uC800\uC7A5 \uC911 \uC624\uB958 \uBC1C\uC0DD");
    } finally {
      setSaving(false);
    }
  }
  const handleDelete = _react.useCallback.call(void 0, async (id) => {
    const item = items.find((i) => i.id === id);
    const label = item ? config.meta.getItemLabel(item) : id;
    if (!confirm(`"${label}"\uC744(\uB97C) \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`)) return;
    try {
      const res = await _chunkRKWWRCLNjs.adminFetch.call(void 0, `${config.apiPath}/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        if (selectedId === id) {
          setSelectedId(null);
          setTab("list");
        }
      } else {
        _sonner.toast.error("\uC0AD\uC81C\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
      }
    } catch (e4) {
      _sonner.toast.error("\uC0AD\uC81C \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.");
    }
  }, [items, selectedId, config.apiPath, config.meta]);
  const listScrollRef = _react.useRef.call(void 0, null);
  const virtualizer = _reactvirtual.useVirtualizer.call(void 0, {
    count: filteredItems.length,
    getScrollElement: () => listScrollRef.current,
    estimateSize: () => 58,
    overscan: 5
  });
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: `pm${mobilePv ? " mobile-pv-on" : ""}`, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "pm-topbar", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "pm-tb-l", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "pm-tb-logo", children: config.meta.appTitle }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "pm-tb-sep" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "pm-tb-pg", children: config.meta.pageTitle })
    ] }) }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "pm-tabs", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "div",
        {
          className: `pm-tab ${tab === "list" ? "on" : ""}`,
          onClick: () => {
            setTab("list");
            _optionalChain([config, 'access', _9 => _9.onNavigateToList, 'optionalCall', _10 => _10()]);
          },
          children: config.meta.listTabLabel
        }
      ),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "div",
        {
          className: `pm-tab ${tab === "edit" ? "on" : ""}`,
          onClick: () => setTab("edit"),
          children: "\uD3B8\uC9D1 + \uBBF8\uB9AC\uBCF4\uAE30"
        }
      )
    ] }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "mobile-pv-bar", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "button",
        {
          type: "button",
          className: `mobile-pv-btn${!mobilePv ? " on" : ""}`,
          onClick: () => setMobilePv(false),
          children: "\uD3B8\uC9D1"
        }
      ),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "button",
        {
          type: "button",
          className: `mobile-pv-btn${mobilePv ? " on" : ""}`,
          onClick: () => setMobilePv(true),
          children: "\uBBF8\uB9AC\uBCF4\uAE30"
        }
      )
    ] }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "pm-body", children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: `pm-panel pm-panel-list ${tab === "list" ? "on" : ""}`, children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "pm-list-left", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "pm-list-header", children: config.renderFilterControls({
            filterValue,
            setFilterValue,
            sortKey,
            setSortKey,
            sortOptions: config.sortOptions,
            searchQuery,
            setSearchQuery,
            filteredCount: filteredItems.length,
            filteredItems,
            onAdd: handleAdd,
            addButtonLabel: config.meta.addButtonLabel,
            allItems: items
          }) }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "pm-perf-list", ref: listScrollRef, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "div",
            {
              style: {
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative"
              },
              children: virtualizer.getVirtualItems().map((virtualRow) => {
                const item = filteredItems[virtualRow.index];
                return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "div",
                  {
                    "data-index": virtualRow.index,
                    ref: virtualizer.measureElement,
                    style: {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`
                    },
                    children: config.renderListItem(item, {
                      isSelected: selectedId === item.id,
                      onSelect: selectItem,
                      onDelete: handleDelete
                    })
                  },
                  item.id
                );
              })
            }
          ) })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "pm-list-right", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "pm-pv-label", children: "\uD648\uD398\uC774\uC9C0 \uBBF8\uB9AC\uBCF4\uAE30" }),
          config.renderListPreview({
            publishedItems,
            onSelectItem: selectItem
          })
        ] })
      ] }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
        "div",
        {
          className: `pm-panel pm-panel-edit ${tab === "edit" ? "on" : ""}`,
          children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "pm-edit-left", children: config.renderEditForm({
              form,
              setForm,
              updateField,
              isNew,
              selectedId,
              saving,
              loading,
              onSave: handleSave,
              onCancel: () => {
                setTab("list");
                _optionalChain([config, 'access', _11 => _11.onNavigateToList, 'optionalCall', _12 => _12()]);
              },
              onDelete: () => {
                if (selectedId) handleDelete(selectedId);
              }
            }) }),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "pm-edit-right", children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "pm-pv-label", children: "\uC2E4\uC2DC\uAC04 \uBBF8\uB9AC\uBCF4\uAE30" }),
              config.renderDetailPreview({ form, isNew, selectedId })
            ] })
          ]
        }
      )
    ] }),
    _optionalChain([config, 'access', _13 => _13.renderModal, 'optionalCall', _14 => _14()])
  ] });
}
function AdminManagerBase(props) {
  const { ref, ...rest } = props;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AdminManagerBaseInner, { ...rest, innerRef: ref });
}

// src/components/ImageDropUpload.tsx

require('./image-drop-zone.css');

function ImageDropUpload({
  src,
  onUpload,
  onKeyTracked,
  className = "",
  placeholder = "\uD074\uB9AD \uB610\uB294 \uB4DC\uB798\uADF8\uD558\uC5EC \uC774\uBBF8\uC9C0 \uCD94\uAC00"
}) {
  const inputRef = _react.useRef.call(void 0, null);
  const drop = _chunkHHGHLX5Jjs.useImageDropZone.call(void 0, {
    onUpload: (result) => onUpload(result.url, result.key),
    onKeyTracked
  });
  const cls = [
    className,
    src ? "has" : "",
    drop.isDragOver ? "is-drag-over" : "",
    drop.isUploading ? "is-uploading" : "",
    drop.isResizing ? "is-resizing" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "input",
      {
        ref: inputRef,
        type: "file",
        accept: "image/*",
        style: { display: "none" },
        onChange: async (e) => {
          await drop.handleFileInput(e.target.files);
          e.target.value = "";
        }
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "div",
      {
        className: cls,
        onClick: () => !drop.isUploading && !drop.isResizing && _optionalChain([inputRef, 'access', _15 => _15.current, 'optionalAccess', _16 => _16.click, 'call', _17 => _17()]),
        ...drop.dragHandlers,
        children: drop.isResizing ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "dz-upload-spinner", children: "\uCD5C\uC801\uD654 \uC911..." }) : drop.isUploading ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "dz-upload-spinner", children: "\uC5C5\uB85C\uB4DC \uC911..." }) : drop.isDragOver ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "dz-drag-hint", children: "\uB193\uC73C\uC138\uC694" }) : src ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { src, alt: "", style: { maxWidth: "100%", height: "auto" } })
        ) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "dz-placeholder", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "dz-placeholder-icon", children: "+" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "dz-placeholder-text", children: placeholder }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "dz-placeholder-guide", children: [
            "JPG, PNG, WebP, GIF | \uCD5C\uB300 5MB",
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "br", {}),
            "\uCD08\uACFC \uC2DC \uC790\uB3D9 \uC555\uCD95 \xB7 1920px \uC774\uD558\uB85C \uB9AC\uC0AC\uC774\uC988",
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "br", {}),
            "WebP \uBCC0\uD658 \xB7 4\uAC1C \uC0AC\uC774\uC988(lg/md/sm/thumb) \uC790\uB3D9 \uC0DD\uC131"
          ] })
        ] })
      }
    ),
    drop.error && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "dz-error", children: drop.error })
  ] });
}

// src/components/ToggleSwitch.tsx
require('./toggle-switch.css');

function ToggleSwitch({
  checked,
  onChange,
  label,
  className = ""
}) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "label", { className: `admin-toggle ${className}`, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: `admin-toggle-track ${checked ? "on" : ""}`, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "admin-toggle-thumb" }) }),
    label && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "admin-toggle-label", children: label }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "input",
      {
        type: "checkbox",
        checked,
        onChange: (e) => onChange(e.target.checked),
        className: "admin-toggle-input"
      }
    )
  ] });
}





exports.AdminManagerBase = AdminManagerBase; exports.ImageDropUpload = ImageDropUpload; exports.ToggleSwitch = ToggleSwitch;
//# sourceMappingURL=chunk-UPRRJTB5.js.map