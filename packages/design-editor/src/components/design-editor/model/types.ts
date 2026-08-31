import {
    BackgroundRemovalProvider,
    DesignTemplate,
    FontProvider,
    PersistenceProvider,
    TemplateProvider,
    TextDesignProvider
} from "../../../providers";
import React from "react";
import {IScene} from "../../../engine";

export type TemplatesPanelRenderProp =
    | React.ReactNode
    | ((props: {
    onApplyTemplate: (t: DesignTemplate) => void;
}) => React.ReactNode);
export type LibraryPanelRenderProp =
    | React.ReactNode
    | ((props: { onAddMedia: (url: string) => void }) => React.ReactNode);

/** Props for the top-level {@link DesignEditor} component. */
export interface DesignEditorProps {
    /** A serialized scene to load on mount, or any scene-shaped object with optional `canvasBg`/`workspaceBg`. */
    initialScene?: IScene | any;
    /** Stable key identifying the scene for persistence; passed to the persistence provider. */
    sceneKey?: string;
    /** Called when the user clicks the back button in the toolbar. */
    onBack?: () => void;
    /** Called when the user exports the design. Receives the rendered Blob, output format, and raw scene JSON. */
    onExport?: (
        blob: Blob,
        format: 'png' | 'jpg' | 'svg',
        scene: IScene
    ) => void | Promise<void>;
    /** Template provider. Defaults to a small bundled starter set. */
    templateProvider?: TemplateProvider;
    /** Text design provider. Defaults to the bundled text designs set. */
    textDesignProvider?: TextDesignProvider;
    /** Font provider. Defaults to a Google Fonts provider. */
    fontProvider?: FontProvider;
    /** Background removal provider. Defaults to `@imgly/background-removal` if installed. */
    backgroundRemovalProvider?: BackgroundRemovalProvider;
    /** Autosave/scene persistence provider. Defaults to a `localStorage` provider. */
    persistenceProvider?: PersistenceProvider;
    /** Optional className applied to the editor root for outer styling. */
    className?: string;
    /** Custom render override for the Templates panel — useful to inject host-app template UI. */
    templatesPanel?: TemplatesPanelRenderProp;
    /** Custom render override for the Upload/Library panel — useful to inject host-app media library UI. */
    libraryPanel?: LibraryPanelRenderProp;
    /** Optional title to display in the toolbar. Defaults to "Design Studio". */
    title?: React.ReactNode;
}