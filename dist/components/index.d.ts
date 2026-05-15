export { A as AdminShell, a as AdminShellConfig, N as NavItem } from '../AdminShell-cdjjlTEo.js';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode, Dispatch, SetStateAction } from 'react';

interface FilterSlotProps<TItem = unknown> {
    filterValue: string;
    setFilterValue: (v: string) => void;
    sortKey: string;
    setSortKey: (v: string) => void;
    sortOptions: {
        value: string;
        label: string;
    }[];
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    filteredCount: number;
    filteredItems: TItem[];
    onAdd: () => void;
    addButtonLabel: string;
    allItems: TItem[];
}
interface ListItemSlotProps<TItem> {
    isSelected: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}
interface EditFormSlotProps<TForm> {
    form: TForm;
    setForm: Dispatch<SetStateAction<TForm>>;
    updateField: <K extends keyof TForm>(key: K, value: TForm[K]) => void;
    isNew: boolean;
    selectedId: string | null;
    saving: boolean;
    loading: boolean;
    onSave: () => void;
    onCancel: () => void;
    onDelete: () => void;
}
interface DetailPreviewSlotProps<TForm> {
    form: TForm;
    isNew: boolean;
    selectedId: string | null;
}
interface ListPreviewSlotProps<TItem> {
    publishedItems: TItem[];
    onSelectItem: (id: string) => void;
}
interface AdminManagerConfig<TItem extends {
    id: string;
}, TForm extends object> {
    meta: {
        appTitle: string;
        pageTitle: string;
        listTabLabel: string;
        addButtonLabel: string;
        getItemLabel: (item: TItem) => string;
        getItemPublished: (item: TItem) => boolean;
    };
    apiPath: string;
    defaultSortKey: string;
    sortOptions: {
        value: string;
        label: string;
    }[];
    emptyForm: TForm;
    loadItem: (apiData: unknown) => TForm;
    buildSavePayload: (form: TForm, ctx: {
        isNew: boolean;
        selectedId: string | null;
        items: TItem[];
    }) => Record<string, unknown>;
    validate: (form: TForm) => string | null;
    normalizeListItem: (raw: unknown) => TItem;
    filterItems: (items: TItem[], filter: string, search: string) => TItem[];
    renderFilterControls: (props: FilterSlotProps<TItem>) => ReactNode;
    renderListItem: (item: TItem, props: ListItemSlotProps<TItem>) => ReactNode;
    renderEditForm: (props: EditFormSlotProps<TForm>) => ReactNode;
    renderDetailPreview: (props: DetailPreviewSlotProps<TForm>) => ReactNode;
    renderListPreview: (props: ListPreviewSlotProps<TItem>) => ReactNode;
    renderModal?: () => ReactNode;
    onAfterSave?: () => void;
    onNavigateToList?: () => void;
}

interface Props$1<TItem extends {
    id: string;
}, TForm extends object> {
    initialItems: TItem[];
    config: AdminManagerConfig<TItem, TForm>;
    /** 초기에 선택할 항목 ID (예: /admin/news/[id] 라우트) */
    initialSelectedId?: string | null;
    /** 최초 진입 시 새 항목 편집 모드로 시작할지 여부 (예: /admin/news/new) */
    startWithNew?: boolean;
    /** 초기 필터 값 (예: 카테고리 필터링) */
    defaultFilterValue?: string;
}
interface AdminManagerBaseHandle {
    selectItem: (id: string) => void;
}
declare function AdminManagerBase<TItem extends {
    id: string;
}, TForm extends object>(props: Props$1<TItem, TForm> & {
    ref?: React.Ref<AdminManagerBaseHandle>;
}): react_jsx_runtime.JSX.Element;

interface Props {
    /** Current image URL */
    src: string;
    /** Called with uploaded image URL and key */
    onUpload: (url: string, key: string) => void;
    /** Track uploaded key for orphan cleanup */
    onKeyTracked?: (key: string) => void;
    /** CSS class for the drop zone container */
    className?: string;
    /** Placeholder text when no image */
    placeholder?: string;
}
declare function ImageDropUpload({ src, onUpload, onKeyTracked, className, placeholder, }: Props): react_jsx_runtime.JSX.Element;

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    className?: string;
}
declare function ToggleSwitch({ checked, onChange, label, className, }: ToggleSwitchProps): react_jsx_runtime.JSX.Element;

export { AdminManagerBase, type AdminManagerBaseHandle, type AdminManagerConfig, type DetailPreviewSlotProps, type EditFormSlotProps, type FilterSlotProps, ImageDropUpload, type ListItemSlotProps, type ListPreviewSlotProps, ToggleSwitch };
