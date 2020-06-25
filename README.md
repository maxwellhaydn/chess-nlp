# chess-nlp

A JavaScript library for converting natural language descriptions of chess moves
to algebraic notation. For example, "bishop takes a8" becomes "Bxa8".

## Installation

    npm install chess-nlp

## Node.js usage

    const ChessNLP = require('chess-nlp');

    const parser = new ChessNLP();
    console.log(parser.textToSan('castle queenside')); // O-O-O

## Browser usage

### Script tag

    <script src="https://unpkg.com/chess-nlp"></script>
    <script>
      var parser = new ChessNLP();
      console.log(parser.textToSan('castle queenside')); // O-O-O
    </script>

### Webpack

    import ChessNLP from 'chess-nlp';

    const parser = new ChessNLP();
    console.log(parser.textToSan('castle queenside')); // O-O-O

## Configuration

The parser can be configured to accept alternate spellings of pieces, ranks,
and files. For example:

    const options = {
        aliases: {
            knight: ['horse', 'jumper'],
            rook: ['tower'],
            a: ['alpha'],
            b: ['beta', 'bravo'],
            c: ['charlie'],
            1: ['i'],
            2: ['ii'],
            3: ['iii']
        }
    };
    const parser = new ChessNLP(options);

    parser.textToSan('Horse to F6');              // Nf6
    parser.textToSan('tower takes b2 checkmate'); // Rxb2#
    parser.textToSan('tower alpha takes bravo7'); // Raxb7
    parser.textToSan('horse charlie to Alpha 4'); // Nca4
    parser.textToSan('tower to betaIII');         // Rb3

The aliases object can contain the following keys:

* king
* queen
* rook
* bishop
* knight
* a
* b
* c
* d
* e
* f
* g
* h
* 1
* 2
* 3
* 4
* 5
* 6
* 7
* 8

## Exceptions

The parser will throw an exception if the supplied text cannot be parsed:

    parser.textToSan('foo'); // Invalid move: foo

## Examples

    bishop to D7                    -> Bd7
    rook A1                         -> Ra1
    queen captures H8               -> Qxh8
    king takes F5                   -> Kxf5
    knight a to B4                  -> Nab4
    Bishop 2 h8                     -> B2h8
    Queen C2D3                      -> Qc2d3
    queen c 2 d 3                   -> Qc2d3
    F captures G4 en passant        -> fxg3
    a takes b5 en passant           -> axb4
    E5                              -> e5
    h take G6                       -> hxg6
    c8 promote to Queen             -> c8=Q
    F captures E8 promote to knight -> fxe8=N
    rook takes b7 mate              -> Rxb7#
    Bishop A c3 check               -> Bac3+
    E7 check                        -> e7+
    castle kingside                 -> O-O
    castle Queenside                -> O-O-O
    Black Resigns                   -> 1-0
    white resigns                   -> 0-1
    king to d seven                 -> Kd7
