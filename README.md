# chess-nlp

A JavaScript library for converting natural language descriptions of chess moves
to algebraic notation and vice versa. For example, "bishop takes a8" becomes
"Bxa8".

## Installation

    npm install chess-nlp

## Node.js usage

    const ChessNLP = require('chess-nlp');

    const parser = new ChessNLP();
    console.log(parser.textToSan('castle queenside')); // O-O-O
    console.log(parser.sanToText('Naxe7#')); // knight a captures e7 checkmate

## Browser usage

### Script tag

    <script src="https://unpkg.com/chess-nlp"></script>
    <script>
      var parser = new ChessNLP();
      console.log(parser.textToSan('castle queenside')); // O-O-O
      console.log(parser.sanToText('Naxe7#')); // knight a captures e7 checkmate
    </script>

### Webpack

    import ChessNLP from 'chess-nlp';

    const parser = new ChessNLP();
    console.log(parser.textToSan('castle queenside')); // O-O-O
    console.log(parser.sanToText('Naxe7#')); // knight a captures e7 checkmate

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

## Methods

### textToSan(text) / toSAN(text)

Convert `text` to standard algebraic notation. Throws an exception if the text
isn't a valid chess move.

    parser.textToSan('foo'); // Invalid move: foo

#### Examples

    bishop to D7                    -> Bd7
    rook A1                         -> Ra1
    queen captures H8               -> Qxh8
    king takes F5                   -> Kxf5
    knight a to B4                  -> Nab4
    Bishop 2 h8                     -> B2h8
    Queen C2D3                      -> Qc2d3
    queen c 2 d 3                   -> Qc2d3
    F captures G4 en passant        -> fxg3
    a takes b5 en passant           -> axb6
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

### sanToText(san) / fromSAN(san)

Convert `san` to a natural language description. Throws an exception if the text
isn't a valid chess move.

    parser.sanToText('bar'); // Invalid move: bar

#### Examples

    e4      -> e4
    hxg2    -> h captures g2
    axb8=Q  -> a captures b8 promote to queen
    cxd1=Q+ -> c captures d1 promote to queen check
    d8=Q#   -> d8 promote to queen checkmate
    f1=N    -> f1 promote to knight
    Kg2     -> king to g2
    Qh7     -> queen to h7
    Rab7    -> rook a to b7
    Bc4     -> bishop to c4
    N6e7    -> knight 6 to e7
    O-O     -> castle kingside
    O-O-O   -> castle queenside
    0-1     -> black wins
    1-0     -> white wins
    1/2-1/2 -> draw

## Configuration (for Spanish grammar)
The parser can be configured to accept spanish grammar.

    const options = {
        language: 'es'
        }
    };
    const parser = new ChessNLP(options);

You can use both, aliases and language configurations:

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
        },
        language: 'es'
        }
    };
    
    const parser = new ChessNLP(options);

Language are mutually exclusive, if you set spanish, you can't parse english grammar and viceversa.
Default language is english.

#### sanToText(san) / fromSAN(san) examples (spanish grammar)

    e4      -> e4
    hxg2    -> h por g2
    axb8=Q  -> a por b8 igual dama
    cxd1=Q+ -> c por d1 igual dama jaque
    d8=Q#   -> d8 igual dama jaque mate
    f1=N    -> f1 igual caballo
    Kg2     -> rey g2
    Qh7     -> dama h7
    Rab7    -> torre a b7
    Bc4     -> alfil c4
    N6e7    -> caballo 6 e7
    O-O     -> enroque corto
    O-O-O   -> enroque largo
    0-1     -> ganan negras
    1-0     -> ganan blancas
    1/2-1/2 -> tablas

#### textToSan(text) / toSAN(text) examples (spanish grammar)

    alfil d7                   -> Bd7
    torre A1                   -> Ra1
    dama por H8                -> Qxh8
    rey por F5                 -> Kxf5
    caballo a B4               -> Nab4
    alfil 2 h8                 -> B2h8
    dama C2D3                  -> Qc2d3
    dama C 2 D 3               -> Qc2d3
    F captura g4 al paso       -> fxg3
    a por b5 al paso           -> axb6
    e5                         -> e5
    h por G6                   -> hxg6
    c8 igual dama              -> c8=Q
    f captura e8 igual caballo -> fxe8=N
    torre por b7 jaque mate    -> Rxb7#
    alfil a c3 jaque           -> Bac3+
    e7 jaque                   -> e7+
    enroque                    -> O-O
    enroque largo              -> O-O-O
    negras abandonan           -> 1-0
    blancas abandonan          -> 0-1
    rey d7                     -> Kd7
