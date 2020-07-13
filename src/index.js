import peg from 'pegjs';

import sanToTextGrammar from './grammar/sanToText';
import textToSanGrammar from './grammar/textToSan';
import sanToTextGrammarES from './grammar/sanToTextES';
import textToSanGrammarES from './grammar/textToSanES';

// Rules that can be configured by the user. For example, users could add
// aliases for common misspellings of terms, like "night" instead of "knight"
const configurableRules = {
    // Pieces
    king: {
        name: 'king',
        defaultTerms: ['king', 'rey'],
        action: "return 'K';"
    },
    queen: {
        name: 'queen',
        defaultTerms: ['queen', 'dama'],
        action: "return 'Q';"
    },
    rook: {
        name: 'rook',
        defaultTerms: ['rook', 'torre'],
        action: "return 'R';"
    },
    bishop: {
        name: 'bishop',
        defaultTerms: ['bishop', 'alfil'],
        action: "return 'B';"
    },
    knight: {
        name: 'knight',
        defaultTerms: ['knight', 'caballo'],
        action: "return 'N';"
    },
    // Files
    a: {
        name: 'file_a',
        defaultTerms: ['a'],
        action: "return 'a';"
    },
    b: {
        name: 'file_b',
        defaultTerms: ['b'],
        action: "return 'b';"
    },
    c: {
        name: 'file_c',
        defaultTerms: ['c'],
        action: "return 'c';"
    },
    d: {
        name: 'file_d',
        defaultTerms: ['d'],
        action: "return 'd';"
    },
    e: {
        name: 'file_e',
        defaultTerms: ['e'],
        action: "return 'e';"
    },
    f: {
        name: 'file_f',
        defaultTerms: ['f'],
        action: "return 'f';"
    },
    g: {
        name: 'file_g',
        defaultTerms: ['g'],
        action: "return 'g';"
    },
    h: {
        name: 'file_h',
        defaultTerms: ['h'],
        action: "return 'h';"
    },
    // Ranks
    1: {
        name: 'rank_1',
        defaultTerms: ['1', 'one'],
        action: "return '1';"
    },
    2: {
        name: 'rank_2',
        defaultTerms: ['2', 'two'],
        action: "return '2';"
    },
    3: {
        name: 'rank_3',
        defaultTerms: ['3', 'three'],
        action: "return '3';"
    },
    4: {
        name: 'rank_4',
        defaultTerms: ['4', 'four'],
        action: "return '4';"
    },
    5: {
        name: 'rank_5',
        defaultTerms: ['5', 'five'],
        action: "return '5';"
    },
    6: {
        name: 'rank_6',
        defaultTerms: ['6', 'six'],
        action: "return '6';"
    },
    7: {
        name: 'rank_7',
        defaultTerms: ['7', 'seven'],
        action: "return '7';"
    },
    8: {
        name: 'rank_8',
        defaultTerms: ['8', 'eight'],
        action: "return '8';"
    },
};

/**
 * Given a configurable rule and an array of aliases, generate the rule text to
 * be added to the parser grammar.
 */
const generateRuleText = (rule, aliases) => {
    // Sort terms by length, with longest terms first to avoid matching shorter
    // terms that are substrings of longer ones, and make all matches case
    // insensitive
    const terms = [...rule.defaultTerms, ...aliases]
        .sort((a, b) => b.length - a.length)
        .map(term => `'${term}'i`);

    return `${rule.name} = ( ${terms.join(' / ')} ) { ${rule.action} }\n`;
};

/**
 * Convert natural language text to chess standard algebraic notation (SAN).
 *
 * Examples:
 *
 *     c6                       -> c6       ES: c6
 *     f captures g4 en passant -> fxg3     ES: f captura g4 al paso
 *     bishop a takes e4        -> Baxe4    ES: alfil por/toma e4
 *     castle queenside         -> O-O-O    ES: enroque largo
 *     white resigns            -> 0-1      ES: blancas abandonan
 */
const ChessNLP = class ChessNLP {

    constructor({ aliases = {}, language = 'en' }) {
        this.aliases = aliases;

        // Take the ES grammar if the entry param is 'es'
        if (language.toLowerCase()==='es') {
            this.textToSanGrammar = textToSanGrammarES;
            this.sanToTextGrammar = sanToTextGrammarES;
        } else {
            this.textToSanGrammar = textToSanGrammar;
            this.sanToTextGrammar = sanToTextGrammar;
        }

        // Generate the text for configurable rules, applying any aliases
        // supplied by the user, and append to the default grammar
        for (let ruleTarget in configurableRules) {
            const rule = configurableRules[ruleTarget];
            this.textToSanGrammar +=
                generateRuleText(rule, this.aliases[ruleTarget] || []);
        }

        this.textToSanParser = peg.generate(this.textToSanGrammar);
        this.sanToTextParser = peg.generate(this.sanToTextGrammar);
    }

    textToSan(text) {
        try {
            return this.textToSanParser.parse(text);
        }
        catch (error) {
            if (error.name === 'SyntaxError') {
                throw new Error(`Invalid move: ${text}`);
            }

            throw error;
        }
    }

    sanToText(san) {
        try {
            return this.sanToTextParser.parse(san);
        }
        catch (error) {
            if (error.name === 'SyntaxError') {
                throw new Error(`Invalid move: ${san}`);
            }

            throw error;
        }
    }

};

// Allow users to call either textToSan() or toSAN() and either sanToText() or
// fromSAN()
ChessNLP.prototype.toSAN = ChessNLP.prototype.textToSan;
ChessNLP.prototype.fromSAN = ChessNLP.prototype.sanToText;

export default ChessNLP;
