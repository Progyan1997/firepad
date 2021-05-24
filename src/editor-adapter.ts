import { ICursor } from "./cursor";
import { IEvent, EventListener } from "./emitter";
import { ITextOperation } from "./text-operation";
import { IDisposable, VoidFunctionType } from "./utils";

export type UndoRedoCallbackType = VoidFunctionType;
export type ClientIDType = string | number;

/** Event handler callback Parameters for `change` event */
type EditorOnChangeFunctionType = (
  operation: ITextOperation,
  inverse: ITextOperation
) => void;

/** Additional State Information about Editor Adapter */
export type EditorAdapterStateType = {
  retain: number;
  skippedChars: number;
  contentLength: number;
};

/** Event parameters for `error` event on Editor Adapter */
export type EditorOnErrorFunctionType = (
  /** Original Error event */
  error: Error,
  /** String representation of the Text Operation */
  operation: string,
  /** Additional State Information about Editor Adapter */
  state: EditorAdapterStateType
) => void;

export enum EditorAdapterEvent {
  Error = "error",
  Blur = "blur",
  Focus = "focus",
  Undo = "undo",
  Redo = "redo",
  Change = "change",
  CursorActivity = "cursorActivity",
}

export type EditorEventCallbackType = {
  [EditorAdapterEvent.Blur]: VoidFunctionType;
  [EditorAdapterEvent.Focus]: VoidFunctionType;
  [EditorAdapterEvent.Error]: EditorOnErrorFunctionType;
  [EditorAdapterEvent.Change]: EditorOnChangeFunctionType;
  [EditorAdapterEvent.CursorActivity]: VoidFunctionType;
};

export interface IEditorAdapterEvent extends IEvent {}

export interface IEditorAdapter extends IDisposable {
  /**
   * Add listener to Editor Adapter.
   * @param event - Event name.
   * @param listener - Event handler callback.
   */
  on(
    event: EditorAdapterEvent,
    listener: EventListener<IEditorAdapterEvent>
  ): void;
  /**
   * Remove listener to Editor Adapter.
   * @param event - Event name.
   * @param listener - Event handler callback.
   */
  off(
    event: EditorAdapterEvent,
    listener: EventListener<IEditorAdapterEvent>
  ): void;
  /**
   * `registerCallback` attaches callback for Editor Event handling from top-level.
   * @param callbacks - Map of Editor Events and Callbacks.
   */
  registerCallbacks(callbacks: EditorEventCallbackType): void;
  /**
   * `registerUndo` attaches callback for Editor Event handling from top-level.
   * @param callback - Undo Event Handler.
   */
  registerUndo(callback: UndoRedoCallbackType): void;
  /**
   * `registerRedo` attaches callback for Editor Event handling from top-level.
   * @param callback - Redo Event Handler.
   */
  registerRedo(callback: UndoRedoCallbackType): void;
  /**
   * `getCursor` Returns Cursor position of current User in Editor.
   */
  getCursor(): ICursor | null;
  /**
   * `setCursor` Add Cursor position of current User in Editor.
   * @param cursor - Cursor position of Current User.
   */
  setCursor(cursor: ICursor): void;
  /**
   * `setOtherCursor` Add Cursor position of Remote Users in Editor.
   * @param clientID - Remote User ID.
   * @param cursor - Cursor Object of Remote User.
   * @param userColor - HexaDecimal/RGB Color Code for Cursor/Selection.
   * @param userName - User Name to show on Cursor (optional).
   */
  setOtherCursor(
    clientID: ClientIDType,
    cursor: ICursor,
    userColor: string,
    userName?: string
  ): IDisposable;
  /**
   * `getText` Returns current content of the Editor.
   */
  getText(): string;
  /**
   * `setText` Sets current content of the Editor.
   * @param text - Text Content.
   */
  setText(text: string): void;
  /**
   * Applies operation into Editor.
   * @param operation - Text Operation.
   */
  applyOperation(operation: ITextOperation): void;
  /**
   * Returns invert operation based on current Editor content
   * @param operation - Text Operation.
   */
  invertOperation(operation: ITextOperation): ITextOperation;
}
