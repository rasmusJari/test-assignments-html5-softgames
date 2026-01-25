// dialogueParser.ts

// =====================
// Types
// =====================

export interface RawDialogueLine {
    name: string;
    text: string;
}

export interface RawDialogueData {
    dialogue: RawDialogueLine[];
}

export interface DialogueLine {
    speaker: string;
    text: string;
    emotion?: string;
}

// =====================
// Parser
// =====================

export class DialogueParser {

    /**
     * Parse full dialogue JSON object
     */
    static parse(data: RawDialogueData): DialogueLine[] {
        return data.dialogue.map(this.parseLine);
    }

    /**
     * Parse a single dialogue line
     */
    private static parseLine(raw: RawDialogueLine): DialogueLine {
        const emotionMatch = raw.text.match(/\{([^}]+)\}/);
        return {
            
            speaker: raw.name,
            emotion: emotionMatch?.[1],
            text: raw.text.replace(/\{[^}]+\}/, '').trim()
        };
    }
}
