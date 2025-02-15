import type { Target } from "../../../typings/target.types";
import type {
  ContainingScopeModifier,
  EveryScopeModifier,
} from "../../../core/commandRunner/typings/PartialTargetDescriptor.types";
import type { ProcessedTargetsContext } from "../../../typings/Types";
import type { ModifierStage } from "../../PipelineStages.types";
import { NotebookCellTarget } from "../../targets";

export default class implements ModifierStage {
  constructor(private modifier: ContainingScopeModifier | EveryScopeModifier) {}

  run(context: ProcessedTargetsContext, target: Target): NotebookCellTarget[] {
    if (this.modifier.type === "everyScope") {
      throw new Error(`Every ${this.modifier.type} not yet implemented`);
    }

    return [
      new NotebookCellTarget({
        editor: target.editor,
        isReversed: target.isReversed,
        contentRange: target.contentRange,
      }),
    ];
  }
}
