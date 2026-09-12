import {
  useAdminForm,
  useAdminList,
  useImageDropZone
} from "./chunk-4DTUND3E.mjs";
import {
  adminFetch
} from "./chunk-JSUEPRBT.mjs";

// src/components/AdminManagerBase.tsx
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { toast } from "sonner";
import { jsx, jsxs } from "react/jsx-runtime";
function AdminManagerBaseInner({
  initialItems,
  config,
  initialSelectedId,
  startWithNew,
  defaultFilterValue,
  innerRef
}) {
  const list = useAdminList({
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
  const adminForm = useAdminForm(config.emptyForm);
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
  useEffect(() => {
    if (startWithNew) {
      handleAdd();
      return;
    }
    if (initialSelectedId) {
      selectItem(initialSelectedId);
    }
  }, []);
  const filteredItems = useMemo(
    () => config.filterItems(items, filterValue, searchQuery),
    [items, filterValue, searchQuery, config]
  );
  const publishedItems = useMemo(
    () => items.filter(config.meta.getItemPublished),
    [items, config]
  );
  const selectItem = useCallback(async (id) => {
    startEdit(id, config.emptyForm);
    try {
      const res = await adminFetch(`${config.apiPath}/${id}`);
      const json = await res.json();
      if (json.success) {
        setForm(config.loadItem(json.data));
      } else {
        toast.error(json.error?.message || "\uB370\uC774\uD130 \uB85C\uB4DC \uC2E4\uD328");
      }
    } catch {
      toast.error("\uB370\uC774\uD130 \uB85C\uB4DC \uC2E4\uD328");
    } finally {
      setLoading(false);
    }
  }, [config.apiPath, config.loadItem, config.emptyForm]);
  useImperativeHandle(innerRef, () => ({ selectItem }), [selectItem]);
  const handleAdd = useCallback(() => {
    addNew(config.emptyForm);
  }, [config.emptyForm]);
  async function handleSave() {
    const err = config.validate(form);
    if (err) {
      toast.error(err);
      return;
    }
    const payload = config.buildSavePayload(form, { isNew, selectedId, items });
    const url = isNew ? config.apiPath : `${config.apiPath}/${selectedId}`;
    const method = isNew ? "POST" : "PUT";
    setSaving(true);
    try {
      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        const listRes = await adminFetch(`${config.apiPath}?limit=100&sortBy=${sortKey}`);
        const listJson = await listRes.json();
        if (listJson.success) {
          setItems(listJson.data.items.map(config.normalizeListItem));
        }
        setTab("list");
        setSelectedId(null);
        toast.success("\uC800\uC7A5 \uC644\uB8CC");
        config.onAfterSave?.();
        config.onNavigateToList?.();
      } else {
        toast.error(json.error?.message || "\uC800\uC7A5 \uC2E4\uD328");
      }
    } catch {
      toast.error("\uC800\uC7A5 \uC911 \uC624\uB958 \uBC1C\uC0DD");
    } finally {
      setSaving(false);
    }
  }
  const handleDelete = useCallback(async (id) => {
    const item = items.find((i) => i.id === id);
    const label = item ? config.meta.getItemLabel(item) : id;
    if (!confirm(`"${label}"\uC744(\uB97C) \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`)) return;
    try {
      const res = await adminFetch(`${config.apiPath}/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        if (selectedId === id) {
          setSelectedId(null);
          setTab("list");
        }
      } else {
        toast.error("\uC0AD\uC81C\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
      }
    } catch {
      toast.error("\uC0AD\uC81C \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.");
    }
  }, [items, selectedId, config.apiPath, config.meta]);
  const listScrollRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => listScrollRef.current,
    estimateSize: () => 58,
    overscan: 5
  });
  return /* @__PURE__ */ jsxs("div", { className: `pm${mobilePv ? " mobile-pv-on" : ""}`, children: [
    /* @__PURE__ */ jsx("div", { className: "pm-topbar", children: /* @__PURE__ */ jsxs("div", { className: "pm-tb-l", children: [
      /* @__PURE__ */ jsx("span", { className: "pm-tb-logo", children: config.meta.appTitle }),
      /* @__PURE__ */ jsx("span", { className: "pm-tb-sep" }),
      /* @__PURE__ */ jsx("span", { className: "pm-tb-pg", children: config.meta.pageTitle })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "pm-tabs", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `pm-tab ${tab === "list" ? "on" : ""}`,
          onClick: () => {
            setTab("list");
            config.onNavigateToList?.();
          },
          children: config.meta.listTabLabel
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `pm-tab ${tab === "edit" ? "on" : ""}`,
          onClick: () => setTab("edit"),
          children: "\uD3B8\uC9D1 + \uBBF8\uB9AC\uBCF4\uAE30"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mobile-pv-bar", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: `mobile-pv-btn${!mobilePv ? " on" : ""}`,
          onClick: () => setMobilePv(false),
          children: "\uD3B8\uC9D1"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: `mobile-pv-btn${mobilePv ? " on" : ""}`,
          onClick: () => setMobilePv(true),
          children: "\uBBF8\uB9AC\uBCF4\uAE30"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pm-body", children: [
      /* @__PURE__ */ jsxs("div", { className: `pm-panel pm-panel-list ${tab === "list" ? "on" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "pm-list-left", children: [
          /* @__PURE__ */ jsx("div", { className: "pm-list-header", children: config.renderFilterControls({
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
          /* @__PURE__ */ jsx("div", { className: "pm-perf-list", ref: listScrollRef, children: /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative"
              },
              children: virtualizer.getVirtualItems().map((virtualRow) => {
                const item = filteredItems[virtualRow.index];
                return /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsxs("div", { className: "pm-list-right", children: [
          /* @__PURE__ */ jsx("div", { className: "pm-pv-label", children: "\uD648\uD398\uC774\uC9C0 \uBBF8\uB9AC\uBCF4\uAE30" }),
          config.renderListPreview({
            publishedItems,
            onSelectItem: selectItem
          })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `pm-panel pm-panel-edit ${tab === "edit" ? "on" : ""}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "pm-edit-left", children: config.renderEditForm({
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
                config.onNavigateToList?.();
              },
              onDelete: () => {
                if (selectedId) handleDelete(selectedId);
              }
            }) }),
            /* @__PURE__ */ jsxs("div", { className: "pm-edit-right", children: [
              /* @__PURE__ */ jsx("div", { className: "pm-pv-label", children: "\uC2E4\uC2DC\uAC04 \uBBF8\uB9AC\uBCF4\uAE30" }),
              config.renderDetailPreview({ form, isNew, selectedId })
            ] })
          ]
        }
      )
    ] }),
    config.renderModal?.()
  ] });
}
function AdminManagerBase(props) {
  const { ref, ...rest } = props;
  return /* @__PURE__ */ jsx(AdminManagerBaseInner, { ...rest, innerRef: ref });
}

// src/components/ImageDropUpload.tsx
import { useRef as useRef2 } from "react";
import "./image-drop-zone.css";
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function ImageDropUpload({
  src,
  onUpload,
  onKeyTracked,
  className = "",
  placeholder = "\uD074\uB9AD \uB610\uB294 \uB4DC\uB798\uADF8\uD558\uC5EC \uC774\uBBF8\uC9C0 \uCD94\uAC00"
}) {
  const inputRef = useRef2(null);
  const drop = useImageDropZone({
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
  return /* @__PURE__ */ jsxs2(Fragment, { children: [
    /* @__PURE__ */ jsx2(
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
    /* @__PURE__ */ jsx2(
      "div",
      {
        className: cls,
        onClick: () => !drop.isUploading && !drop.isResizing && inputRef.current?.click(),
        ...drop.dragHandlers,
        children: drop.isResizing ? /* @__PURE__ */ jsx2("span", { className: "dz-upload-spinner", children: "\uCD5C\uC801\uD654 \uC911..." }) : drop.isUploading ? /* @__PURE__ */ jsx2("span", { className: "dz-upload-spinner", children: "\uC5C5\uB85C\uB4DC \uC911..." }) : drop.isDragOver ? /* @__PURE__ */ jsx2("span", { className: "dz-drag-hint", children: "\uB193\uC73C\uC138\uC694" }) : src ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          /* @__PURE__ */ jsx2("img", { src, alt: "", style: { maxWidth: "100%", height: "auto" } })
        ) : /* @__PURE__ */ jsxs2("div", { className: "dz-placeholder", children: [
          /* @__PURE__ */ jsx2("div", { className: "dz-placeholder-icon", children: "+" }),
          /* @__PURE__ */ jsx2("div", { className: "dz-placeholder-text", children: placeholder }),
          /* @__PURE__ */ jsxs2("div", { className: "dz-placeholder-guide", children: [
            "JPG, PNG, WebP, GIF | \uCD5C\uB300 5MB",
            /* @__PURE__ */ jsx2("br", {}),
            "\uCD08\uACFC \uC2DC \uC790\uB3D9 \uC555\uCD95 \xB7 1920px \uC774\uD558\uB85C \uB9AC\uC0AC\uC774\uC988",
            /* @__PURE__ */ jsx2("br", {}),
            "WebP \uBCC0\uD658 \xB7 4\uAC1C \uC0AC\uC774\uC988(lg/md/sm/thumb) \uC790\uB3D9 \uC0DD\uC131"
          ] })
        ] })
      }
    ),
    drop.error && /* @__PURE__ */ jsx2("div", { className: "dz-error", children: drop.error })
  ] });
}

// src/components/ToggleSwitch.tsx
import "./toggle-switch.css";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function ToggleSwitch({
  checked,
  onChange,
  label,
  className = ""
}) {
  return /* @__PURE__ */ jsxs3("label", { className: `admin-toggle ${className}`, children: [
    /* @__PURE__ */ jsx3("span", { className: `admin-toggle-track ${checked ? "on" : ""}`, children: /* @__PURE__ */ jsx3("span", { className: "admin-toggle-thumb" }) }),
    label && /* @__PURE__ */ jsx3("span", { className: "admin-toggle-label", children: label }),
    /* @__PURE__ */ jsx3(
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

export {
  AdminManagerBase,
  ImageDropUpload,
  ToggleSwitch
};
//# sourceMappingURL=chunk-5ZEXSS77.mjs.map