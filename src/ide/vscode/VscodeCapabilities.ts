import {
  Capabilities,
  CommandCapabilityMap,
} from "../../libs/common/ide/types/Capabilities";

const COMMAND_CAPABILITIES: CommandCapabilityMap = {
  clipboardCopy: { acceptsLocation: false },
  toggleLineComment: { acceptsLocation: false },
  indentLine: { acceptsLocation: false },
  outdentLine: { acceptsLocation: false },
  rename: { acceptsLocation: false },
  quickFix: { acceptsLocation: false },
  revealDefinition: { acceptsLocation: false },
  revealTypeDefinition: { acceptsLocation: false },
  showHover: { acceptsLocation: false },
  showDebugHover: { acceptsLocation: false },
  extractVariable: { acceptsLocation: false },
  fold: { acceptsLocation: true },
  unfold: { acceptsLocation: true },
  showReferences: { acceptsLocation: false },
};

export class VscodeCapabilities implements Capabilities {
  commands = COMMAND_CAPABILITIES;
}
