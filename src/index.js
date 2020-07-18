import peg from 'pegjs';

import sanToTextGrammarEN from './grammar/en/sanToText';
import textToSanGrammarEN from './grammar/en/textToSan';
import sanToTextGrammarES from './grammar/es/sanToText';
import textToSanGrammarES from './grammar/es/textToSan';

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

// ChessNLP class
const ChessNLP = class ChessNLP {

    constructor({ aliases = {}, language = 'en' } = {}) {
        
        this.aliases = aliases;
        this.language = language;

        let configurableRules;

        // Take correct grammar based on language param
        switch (this.language.toLowerCase()) {
            case 'es':
                configurableRules = require('./grammar/es/aliases.json');
                this.textToSanGrammar = textToSanGrammarES;
                this.sanToTextGrammar = sanToTextGrammarES;
                break;           

            default:
                configurableRules = require('./grammar/en/aliases.json');
                this.textToSanGrammar = textToSanGrammarEN;
                this.sanToTextGrammar = sanToTextGrammarEN;
        }
  
        // Rules that can be configured by the user. For example, users could add
        // aliases for common misspellings of terms, like "night" instead of "knight"
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
                switch (this.language.toLowerCase()) {
                    case 'es':
                        throw new Error(`Movimiento inválido: ${text}`);
        
                    default:
                        throw new Error(`Invalid move: ${text}`);
                }
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
                switch (this.language.toLowerCase()) {
                    case 'es':
                        throw new Error(`Movimiento inválido: ${san}`);
        
                    default:
                        throw new Error(`Invalid move: ${san}`);
                }
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
