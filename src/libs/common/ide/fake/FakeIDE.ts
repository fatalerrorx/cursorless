import type { EditableTextEditor, TextEditor } from "@cursorless/common";
import { pull } from "lodash";
import { TextDocument } from "../../types/TextDocument";
import type { TextDocumentChangeEvent } from "../types/Events";
import {
  Event,
  TextEditorSelectionChangeEvent,
  TextEditorVisibleRangesChangeEvent,
} from "../types/events.types";
import type {
  Disposable,
  IDE,
  RunMode,
  WorkspaceFolder,
} from "../types/ide.types";
import { FakeCapabilities } from "./FakeCapabilities";
import FakeClipboard from "./FakeClipboard";
import FakeConfiguration from "./FakeConfiguration";
import FakeGlobalState from "./FakeGlobalState";
import { FakeHats } from "./FakeHats";
import FakeMessages from "./FakeMessages";

export default class FakeIDE implements IDE {
  configuration: FakeConfiguration = new FakeConfiguration();
  messages: FakeMessages = new FakeMessages();
  globalState: FakeGlobalState = new FakeGlobalState();
  clipboard: FakeClipboard = new FakeClipboard();
  capabilities: FakeCapabilities = new FakeCapabilities();
  hats: FakeHats = new FakeHats();

  runMode: RunMode = "test";
  workspaceFolders: readonly WorkspaceFolder[] | undefined = undefined;
  private disposables: Disposable[] = [];
  private assetsRoot_: string | undefined;

  onDidOpenTextDocument: Event<TextDocument> = dummyEvent;
  onDidCloseTextDocument: Event<TextDocument> = dummyEvent;
  onDidChangeActiveTextEditor: Event<TextEditor | undefined> = dummyEvent;
  onDidChangeVisibleTextEditors: Event<TextEditor[]> = dummyEvent;
  onDidChangeTextEditorSelection: Event<TextEditorSelectionChangeEvent> =
    dummyEvent;
  onDidChangeTextEditorVisibleRanges: Event<TextEditorVisibleRangesChangeEvent> =
    dummyEvent;

  public mockAssetsRoot(_assetsRoot: string) {
    this.assetsRoot_ = _assetsRoot;
  }

  get assetsRoot(): string {
    if (this.assetsRoot_ == null) {
      throw Error("Field `assetsRoot` has not yet been mocked");
    }

    return this.assetsRoot_;
  }

  get activeTextEditor(): TextEditor | undefined {
    throw Error("Not implemented");
  }

  get activeEditableTextEditor(): EditableTextEditor | undefined {
    throw Error("Not implemented");
  }

  get visibleTextEditors(): TextEditor[] {
    throw Error("Not implemented");
  }

  public getEditableTextEditor(_editor: TextEditor): EditableTextEditor {
    throw Error("Not implemented");
  }

  public findInWorkspace(_query: string): Promise<void> {
    throw Error("Not implemented");
  }

  public openTextDocument(_path: string): Promise<TextEditor> {
    throw Error("Not implemented");
  }

  public showInputBox(_options?: any): Promise<string | undefined> {
    throw Error("Not implemented");
  }

  executeCommand<T>(_command: string, ..._args: any[]): Promise<T | undefined> {
    throw new Error("Method not implemented.");
  }

  public onDidChangeTextDocument(
    _listener: (event: TextDocumentChangeEvent) => void,
  ): Disposable {
    throw Error("Not implemented");
  }

  disposeOnExit(...disposables: Disposable[]): () => void {
    this.disposables.push(...disposables);

    return () => pull(this.disposables, ...disposables);
  }

  exit(): void {
    this.disposables.forEach((disposable) => disposable.dispose());
  }
}

function dummyEvent() {
  return {
    dispose() {
      // empty
    },
  };
}
