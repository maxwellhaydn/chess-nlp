import peg from 'pegjs';

const grammar = `
    start
        = move

    move
        = // e.g. "bishop d6 check"
          parts:(
              (piece_move / pawn_move / castle) whitespace (checkmate / check)
          )
          { return parts.join(''); }
          /

          // e.g. "Knight to c7"
          (piece_move / pawn_move / castle)
          /

          // e.g. "White resigns"
          resign

    piece_move
        = parts:(
              // e.g. "knight A takes B4"
              piece whitespace departure whitespace action whitespace destination /

              // e.g. "Rook 2 c7"
              piece whitespace departure whitespace destination /

              // e.g. "Queen to H6"
              piece whitespace action whitespace destination /

              // e.g. "king e3"
              piece whitespace destination
          )
          { return parts.join(''); }

    pawn_move
        = // e.g. "a captures b5 en passant"
          en_passant /

          // e.g. "F captures E8 promote to knight"
          parts:(pawn_capture whitespace pawn_promotion)
          { return parts.join(''); }
          /

          // e.g. "c8 promote to Queen"
          parts:(destination whitespace pawn_promotion)
          { return parts.join(''); }
          /

          // e.g. "F takes G3"
          pawn_capture /

          // e.g. "c6"
          destination

    /**
     * In en passant, the move is written as if the captured pawn had only moved
     * one square rather than two. For example, if white's g2 pawn moves to g4
     * and is captured en passant by black's f4 pawn, the move is written as
     * fxg3
     */
    en_passant
        = parts:(
              file
              whitespace
              capture
          )
          whitespace
          dest_file:file
          dest_rank:rank
          whitespace
          'en passant'i
          {
              let final_rank;

              switch (dest_rank) {
                  case '4':           // black capturing white
                      final_rank = 3;
                      break;
                  case '5':           // white capturing black
                      final_rank = 4;
                      break;
                  default:
                      throw new Error('Invalid en passant capture');
              }

              return parts.join('') + dest_file + final_rank;
          }

    pawn_capture
        = parts:(file whitespace capture whitespace destination)
          { return parts.join(''); }

    pawn_promotion
        = 'promote to'i whitespace piece:piece { return '=' + piece; }

    check
        = 'check'i { return '+'; }

    checkmate
        = ('checkmate'i / 'mate'i) { return '#'; }

    castle
        = 'castle'i whitespace side:('kingside'i / 'queenside'i)
          { return /king/i.test(side) ? 'O-O' : 'O-O-O'; }

    resign
        = player:('black'i / 'white'i) whitespace 'resigns'i
          { return /black/i.test(player) ? '1-0' : '0-1'; }

    whitespace
        = ' '* { return ''; }

    action
        = capture / to

    to
        = ('moves to'i / 'move to'i / 'to'i) { return ''; }

    capture
        = ('captures'i / 'capture'i / 'takes'i / 'take'i) { return 'x'; }

    departure
        = square / file / rank

    destination
        = square

    square
        = coordinates:(file rank) { return coordinates.join(''); }

    rank
        = [1-8]

    file
        = letter:[a-h]i { return letter.toLowerCase(); }

    piece
        = king / queen / rook / bishop / knight

`;

// Rules that can be configured by the user. For example, users could add
// aliases for common misspellings of terms, like "night" instead of "knight"
const configurableRules = {
    king: {
        name: 'king',
        defaultTerm: 'king',
        action: `return 'K';`
    },
    queen: {
        name: 'queen',
        defaultTerm: 'queen',
        action: `return 'Q';`
    },
    rook: {
        name: 'rook',
        defaultTerm: 'rook',
        action: `return 'R';`
    },
    bishop: {
        name: 'bishop',
        defaultTerm: 'bishop',
        action: `return 'B';`
    },
    knight: {
        name: 'knight',
        defaultTerm: 'knight',
        action: `return 'N';`
    }
};

/**
 * Given a configurable rule and an array of aliases, generate the rule text to
 * be added to the parser grammar.
 */
const generateRuleText = (rule, aliases) => {
    // Make all terms case insensitive
    const terms = [rule.defaultTerm, ...aliases].map(term => `'${term}'i`);

    return `${rule.name} = ( ${terms.join(' / ')} ) { ${rule.action} }\n`;
};

/**
 * Convert natural language text to chess standard algebraic notation (SAN).
 *
 * Examples:
 *
 *     c6                       -> c6
 *     f captures g4 en passant -> fxg3
 *     bishop a takes e4        -> Baxe4
 *     castle queenside         -> O-O-O
 *     white resigns            -> 0-1
 */
export default class ChessNLP {

    constructor({ aliases } = { aliases: {} }) {
        this.aliases = aliases;
        this.grammar = grammar;

        // Generate the text for configurable rules, applying any aliases
        // supplied by the user, and append to the default grammar
        for (let ruleTarget in configurableRules) {
            const rule = configurableRules[ruleTarget];
            this.grammar +=
                generateRuleText(rule, this.aliases[ruleTarget] || []);
        }

        this.parser = peg.generate(this.grammar);
    }

    toSAN(text) {
        try {
            return this.parser.parse(text);
        }
        catch (error) {
            if (error.name === 'SyntaxError') {
                throw new Error(`Invalid move: ${text}`);
            }

            throw error;
        }
    }

}
