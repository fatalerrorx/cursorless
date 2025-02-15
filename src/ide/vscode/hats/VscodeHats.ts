import { Range, TextEditor } from "@cursorless/common";
import * as vscode from "vscode";
import { Disposable } from "vscode";
import {
  HatRange,
  Hats,
  HatStyleMap,
} from "../../../libs/common/ide/types/Hats";
import { Listener, Notifier } from "../../../libs/common/util/Notifier";
import { toVscodeRange } from "../../../libs/vscode-common/vscodeUtil";
import { VscodeHatStyleName } from "../hatStyles.types";
import VscodeEnabledHatStyleManager from "../VscodeEnabledHatStyleManager";
import VscodeHatRenderer from "./VscodeHatRenderer";
import type VscodeIDE from "../VscodeIDE";
import { VscodeTextEditorImpl } from "../VscodeTextEditorImpl";
import { HatStyleName } from "../../../libs/common/ide/types/hatStyles.types";

export class VscodeHats implements Hats {
  private enabledHatStyleManager: VscodeEnabledHatStyleManager;
  private hatRenderer: VscodeHatRenderer;
  isEnabled: boolean;
  private isEnabledNotifier: Notifier<[boolean]> = new Notifier();
  private hatRanges: HatRange[] = [];

  constructor(
    private ide: VscodeIDE,
    extensionContext: vscode.ExtensionContext,
  ) {
    this.enabledHatStyleManager = new VscodeEnabledHatStyleManager(
      extensionContext,
    );
    this.hatRenderer = new VscodeHatRenderer(
      extensionContext,
      this.enabledHatStyleManager,
    );

    this.toggle = this.toggle.bind(this);
    this.handleHatDecorationMapUpdated =
      this.handleHatDecorationMapUpdated.bind(this);

    this.hatRenderer.registerListener(this.handleHatDecorationMapUpdated);

    this.isEnabled = vscode.workspace
      .getConfiguration("cursorless")
      .get<boolean>("showOnStart")!;

    extensionContext.subscriptions.push(
      vscode.commands.registerCommand(
        "cursorless.toggleDecorations",
        this.toggle,
      ),
    );
  }

  async init() {
    await this.hatRenderer.init();
  }

  private toggle() {
    this.isEnabled = !this.isEnabled;
    this.isEnabledNotifier.notifyListeners(this.isEnabled);
  }

  private handleHatDecorationMapUpdated() {
    if (
      this.hatRanges.some(
        ({ styleName }) => !(styleName in this.enabledHatStyles),
      )
    ) {
      // This happens if the user updated multiple settings simultaneously: one
      // that affects hat rendering and one that alters the set of available
      // hats. If the render setting notification fires first, then applying the
      // old hat decorations will fail, so we bail for now, knowing that the
      // notification for new hat allocations will come immediately after
      return;
    }

    this.applyHatDecorations();
  }

  async setHatRanges(hatRanges: HatRange[]): Promise<void> {
    this.hatRanges = hatRanges;
    await this.applyHatDecorations();
  }

  private async applyHatDecorations(): Promise<void> {
    const hatStyleNames = Object.keys(this.enabledHatStyles);

    await this.hatRenderer.handleNewStylesIfNecessary();

    const decorationRanges: Map<
      TextEditor,
      {
        [decorationName in HatStyleName]?: Range[];
      }
    > = new Map(
      this.ide.visibleTextEditors.map((editor) => [
        editor,
        Object.fromEntries(hatStyleNames.map((name) => [name, []])),
      ]),
    );

    this.hatRanges.forEach(({ editor, range, styleName }) => {
      decorationRanges.get(editor)![styleName]!.push(range);
    });

    decorationRanges.forEach((ranges, editor) => {
      hatStyleNames.forEach((hatStyleName) => {
        (editor as VscodeTextEditorImpl).vscodeEditor.setDecorations(
          this.hatRenderer.getDecorationType(
            hatStyleName as VscodeHatStyleName,
          )!,
          ranges[hatStyleName]?.map((range) => toVscodeRange(range)) ?? [],
        );
      });
    });
  }

  get enabledHatStyles(): HatStyleMap {
    return this.enabledHatStyleManager.hatStyleMap;
  }

  onDidChangeEnabledHatStyles(listener: Listener<[HatStyleMap]>): Disposable {
    return this.enabledHatStyleManager.registerListener(listener);
  }

  onDidChangeIsEnabled(listener: Listener<[boolean]>): Disposable {
    return this.isEnabledNotifier.registerListener(listener);
  }
}
