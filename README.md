# chess-nlp
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

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

### textToSan(text)
### toSAN(text)

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

### sanToText(san)
### fromSAN(san)

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://www.valcarce.com.ar"><img src="https://avatars3.githubusercontent.com/u/59612229?v=4" width="100px;" alt=""/><br /><sub><b>Diego Valcarce</b></sub></a><br /><a href="https://github.com/maxwellhaydn/chess-nlp/commits?author=diegovalcarce" title="Code">💻</a> <a href="https://github.com/maxwellhaydn/chess-nlp/commits?author=diegovalcarce" title="Tests">⚠️</a> <a href="https://github.com/maxwellhaydn/chess-nlp/commits?author=diegovalcarce" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!