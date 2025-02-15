import { TextDocument } from "../types/TextDocument";
import { EditableTextEditor, TextEditor } from "../types/TextEditor";
import { Capabilities } from "./types/Capabilities";
import { Clipboard } from "./types/Clipboard";
import { Configuration } from "./types/Configuration";
import { TextDocumentChangeEvent } from "./types/Events";
import {
  TextEditorSelectionChangeEvent,
  TextEditorVisibleRangesChangeEvent,
} from "./types/events.types";

import { Hats } from "./types/Hats";
import { Disposable, IDE, RunMode, WorkspaceFolder } from "./types/ide.types";
import { Messages } from "./types/Messages";
import { State } from "./types/State";

export default class PassthroughIDEBase implements IDE {
  configuration: Configuration;
  globalState: State;
  clipboard: Clipboard;
  messages: Messages;
  capabilities: Capabilities;
  hats: Hats;

  constructor(private original: IDE) {
    this.configuration = original.configuration;
    this.globalState = original.globalState;
    this.clipboard = original.clipboard;
    this.messages = original.messages;
    this.capabilities = original.capabilities;
    this.hats = original.hats;
  }

  onDidOpenTextDocument(
    listener: (e: TextDocument) => any,
    thisArgs?: any,
    disposables?: Disposable[],
  ): Disposable {
    return this.original.onDidOpenTextDocument(listener, thisArgs, disposables);
  }
  onDidCloseTextDocument(
    listener: (e: TextDocument) => any,
    thisArgs?: any,
    disposables?: Disposable[],
  ): Disposable {
    return this.original.onDidCloseTextDocument(
      listener,
      thisArgs,
      disposables,
    );
  }
  onDidChangeActiveTextEditor(
    listener: (e: TextEditor | undefined) => any,
    thisArgs?: any,
    disposables?: Disposable[],
  ): Disposable {
    return this.original.onDidChangeActiveTextEditor(
      listener,
      thisArgs,
      disposables,
    );
  }
  onDidChangeVisibleTextEditors(
    listener: (e: TextEditor[]) => any,
    thisArgs?: any,
    disposables?: Disposable[],
  ): Disposable {
    return this.original.onDidChangeVisibleTextEditors(
      listener,
      thisArgs,
      disposables,
    );
  }
  onDidChangeTextEditorSelection(
    listener: (e: TextEditorSelectionChangeEvent) => any,
    thisArgs?: any,
    disposables?: Disposable[],
  ): Disposable {
    return this.original.onDidChangeTextEditorSelection(
      listener,
      thisArgs,
      disposables,
    );
  }
  onDidChangeTextEditorVisibleRanges(
    listener: (e: TextEditorVisibleRangesChangeEvent) => any,
    thisArgs?: any,
    disposables?: Disposable[],
  ): Disposable {
    return this.original.onDidChangeTextEditorVisibleRanges(
      listener,
      thisArgs,
      disposables,
    );
  }

  public get activeTextEditor(): TextEditor | undefined {
    return this.original.activeTextEditor;
  }

  public get activeEditableTextEditor(): EditableTextEditor | undefined {
    return this.original.activeEditableTextEditor;
  }

  public get visibleTextEditors(): TextEditor[] {
    return this.original.visibleTextEditors;
  }

  public get assetsRoot(): string {
    return this.original.assetsRoot;
  }

  public get runMode(): RunMode {
    return this.original.runMode;
  }

  public get workspaceFolders(): readonly WorkspaceFolder[] | undefined {
    return this.original.workspaceFolders;
  }

  public findInWorkspace(query: string): Promise<void> {
    return this.original.findInWorkspace(query);
  }

  public openTextDocument(path: string): Promise<TextEditor> {
    return this.original.openTextDocument(path);
  }

  public showInputBox(options?: any): Promise<string | undefined> {
    return this.original.showInputBox(options);
  }

  public getEditableTextEditor(editor: TextEditor): EditableTextEditor {
    return this.original.getEditableTextEditor(editor);
  }

  executeCommand<T>(command: string, ...args: any[]): Promise<T | undefined> {
    return this.original.executeCommand(command, ...args);
  }

  public onDidChangeTextDocument(
    listener: (event: TextDocumentChangeEvent) => void,
  ): Disposable {
    return this.original.onDidChangeTextDocument(listener);
  }

  disposeOnExit(...disposables: Disposable[]): () => void {
    return this.original.disposeOnExit(...disposables);
  }
}
