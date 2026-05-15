import * as react from 'react';
import { DragEvent } from 'react';

declare function useAdminForm<F extends object>(initialForm: F): {
    tab: "list" | "edit";
    setTab: react.Dispatch<react.SetStateAction<"list" | "edit">>;
    form: F;
    setForm: react.Dispatch<react.SetStateAction<F>>;
    updateField: <K extends keyof F>(key: K, value: F[K]) => void;
    selectedId: string | null;
    setSelectedId: react.Dispatch<react.SetStateAction<string | null>>;
    isNew: boolean;
    setIsNew: react.Dispatch<react.SetStateAction<boolean>>;
    saving: boolean;
    setSaving: react.Dispatch<react.SetStateAction<boolean>>;
    loading: boolean;
    setLoading: react.Dispatch<react.SetStateAction<boolean>>;
    mobilePv: boolean;
    setMobilePv: react.Dispatch<react.SetStateAction<boolean>>;
    addNew: (emptyForm: F) => void;
    startEdit: (id: string, emptyForm?: F) => void;
    backToList: () => void;
};

interface UseAdminListOptions<T, S extends string> {
    initialItems: T[];
    apiPath: string;
    defaultSortKey: S;
    normalizeItem?: (raw: unknown) => T;
    defaultFilterValue?: string;
}
declare function useAdminList<T, S extends string = string>(options: UseAdminListOptions<T, S>): {
    items: T[];
    setItems: react.Dispatch<react.SetStateAction<T[]>>;
    searchQuery: string;
    setSearchQuery: react.Dispatch<react.SetStateAction<string>>;
    sortKey: S;
    setSortKey: react.Dispatch<react.SetStateAction<S>>;
    filterValue: string;
    setFilterValue: react.Dispatch<react.SetStateAction<string>>;
    fetchList: (sort: S) => Promise<void>;
};

interface ImageVariantUrls {
    lg?: string;
    md?: string;
    sm?: string;
    thumb?: string;
}
interface UploadResult {
    url: string;
    key: string;
    size: number;
    variants?: ImageVariantUrls;
    variantKeys?: string[];
}
interface UseImageDropZoneOptions {
    multiple?: boolean;
    maxFiles?: number;
    onUpload: (result: UploadResult) => void;
    onKeyTracked?: (key: string) => void;
    disabled?: boolean;
}
declare function useImageDropZone(options: UseImageDropZoneOptions): {
    isDragOver: boolean;
    isUploading: boolean;
    isResizing: boolean;
    error: string | null;
    dragHandlers: {
        onDragEnter: (e: DragEvent) => void;
        onDragOver: (e: DragEvent) => void;
        onDragLeave: (e: DragEvent) => void;
        onDrop: (e: DragEvent) => void;
    };
    handleFileInput: (fileList: FileList | null) => Promise<void>;
};

export { useAdminForm, useAdminList, useImageDropZone };
