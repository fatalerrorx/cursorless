import { Target } from "../../typings/target.types";
import { PositionModifier } from "../../core/commandRunner/typings/PartialTargetDescriptor.types";
import { ProcessedTargetsContext } from "../../typings/Types";
import { ModifierStage } from "../PipelineStages.types";

export default class PositionStage implements ModifierStage {
  constructor(private modifier: PositionModifier) {}

  run(context: ProcessedTargetsContext, target: Target): Target[] {
    return [target.toPositionTarget(this.modifier.position)];
  }
}
