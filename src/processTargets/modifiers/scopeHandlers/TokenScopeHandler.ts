import { imap } from "itertools";
import { NestedScopeHandler } from ".";
import { generateMatchesInRange } from "../../../apps/cursorless-vscode/getMatchesInRange";
import { Direction } from "../../../core/commandRunner/typings/PartialTargetDescriptor.types";
import { getMatcher } from "../../../libs/cursorless-engine/tokenizer";
import { testRegex } from "../../../libs/cursorless-engine/util/regex";
import { TokenTarget } from "../../targets";
import type { TargetScope } from "./scope.types";

export default class TokenScopeHandler extends NestedScopeHandler {
  public readonly scopeType = { type: "token" } as const;
  public readonly iterationScopeType = { type: "line" } as const;

  private regex: RegExp = getMatcher(this.languageId).tokenMatcher;

  protected generateScopesInSearchScope(
    direction: Direction,
    { editor, domain }: TargetScope,
  ): Iterable<TargetScope> {
    return imap(
      generateMatchesInRange(this.regex, editor, domain, direction),
      (range) => ({
        editor,
        domain: range,
        getTarget: (isReversed) =>
          new TokenTarget({
            editor,
            contentRange: range,
            isReversed,
          }),
      }),
    );
  }

  isPreferredOver(
    scopeA: TargetScope,
    scopeB: TargetScope,
  ): boolean | undefined {
    const {
      editor: { document },
    } = scopeA;
    const { identifierMatcher } = getMatcher(document.languageId);

    // NB: Don't directly use `test` here because global regexes are stateful
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#finding_successive_matches
    return testRegex(identifierMatcher, document.getText(scopeA.domain))
      ? true
      : testRegex(identifierMatcher, document.getText(scopeB.domain))
      ? false
      : undefined;
  }
}
