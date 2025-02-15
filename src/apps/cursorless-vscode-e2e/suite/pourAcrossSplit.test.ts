import { getCursorlessApi, openNewEditor } from "@cursorless/vscode-common";
import * as assert from "assert";
import { endToEndTestSetup } from "../endToEndTestSetup";
import { runCursorlessCommand } from "../runCommand";

suite("Pour across split", async function () {
  endToEndTestSetup(this);

  test("Pour across split", runTest);
});

async function runTest() {
  const { graph } = (await getCursorlessApi()).testHelpers!;

  const { document: document1 } = await openNewEditor("hello world");
  const { document: document2 } = await openNewEditor("", { openBeside: true });

  await graph.hatTokenMap.addDecorations();

  await runCursorlessCommand({
    version: 4,
    action: { name: "editNewLineAfter" },
    targets: [
      {
        type: "primitive",
        mark: {
          type: "decoratedSymbol",
          symbolColor: "default",
          character: "h",
        },
      },
    ],
    usePrePhraseSnapshot: false,
  });

  assert.deepStrictEqual(document1.getText(), "hello world\n");
  assert.deepStrictEqual(document2.getText(), "");
}
