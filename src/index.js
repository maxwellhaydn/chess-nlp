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
        = 'castle'i whitespace side:(kingside / queenside)
          { return /king/i.test(side) ? 'O-O' : 'O-O-O'; }

    kingside
        = 'king'i whitespace 'side'i / 'king-side'i / 'kingside'i

    queenside
        = 'queen'i whitespace 'side'i / 'queen-side'i / 'queenside'i

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
        = coordinates:(
              file rank /
              file whitespace rank /
              file:(file) '-' rank:(rank) { return [file, rank]; }
          )
          { return coordinates.join(''); }

    rank
        = rank_1 / rank_2 / rank_3 / rank_4 / rank_5 / rank_6 / rank_7 / rank_8

    file
        = file_a / file_b / file_c / file_d / file_e / file_f / file_g / file_h

    piece
        = king / queen / rook / bishop / knight

`;

// Rules that can be configured by the user. For example, users could add
// aliases for common misspellings of terms, like "night" instead of "knight"
const configurableRules = {
    // Pieces
    king: {
        name: 'king',
        defaultTerms: ['king'],
        action: "return 'K';"
    },
    queen: {
        name: 'queen',
        defaultTerms: ['queen'],
        action: "return 'Q';"
    },
    rook: {
        name: 'rook',
        defaultTerms: ['rook'],
        action: "return 'R';"
    },
    bishop: {
        name: 'bishop',
        defaultTerms: ['bishop'],
        action: "return 'B';"
    },
    knight: {
        name: 'knight',
        defaultTerms: ['knight'],
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
 *     c6                       -> c6
 *     f captures g4 en passant -> fxg3
 *     bishop a takes e4        -> Baxe4
 *     castle queenside         -> O-O-O
 *     white resigns            -> 0-1
 */
const ChessNLP = class ChessNLP {

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

    textToSan(text) {
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

};

// Allow users to call either textToSan() or toSAN()
ChessNLP.prototype.toSAN = ChessNLP.prototype.textToSan;

export default ChessNLP;
