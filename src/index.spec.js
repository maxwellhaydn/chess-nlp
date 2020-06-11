import { expect } from 'chai';

import ChessNLP from './index';

describe('ChessNLP', function() {

    describe('toSAN', function() {

        it.each([
            ['bishop to D7', 'Bd7'],
            ['rook A1', 'Ra1'],
            ['queen captures H8', 'Qxh8'],
            ['king takes F5', 'Kxf5'],
            ['knight a to B4', 'Nab4'],
            ['Bishop 2 h8', 'B2h8'],
            ['Queen C2D3', 'Qc2d3'],
            ['F captures G4 en passant', 'fxg3'],
            ['a takes b5 en passant', 'axb4'],
            ['E5', 'e5'],
            ['h take G6', 'hxg6'],
            ['c8 promote to Queen', 'c8=Q'],
            ['F captures E8 promote to knight', 'fxe8=N'],
            ['rook takes b7 mate', 'Rxb7#'],
            ['Bishop A c3 check', 'Bac3+'],
            ['E7 check', 'e7+'],
            ['castle kingside', 'O-O'],
            ['castle Queenside', 'O-O-O'],
            ['Black Resigns', '1-0'],
            ['white resigns', '0-1'],
        ])('.toSAN(%j)', (text, expected) => {
            const parser = new ChessNLP();

            expect(parser.toSAN(text)).to.equal(expected);
        });

        it('should throw an error on invalid en passant', function() {
            const parser = new ChessNLP();

            expect(() => parser.toSAN('g takes h7 en passant'))
                .to.throw('Invalid en passant capture');
        });

        it("should throw an error when text can't be parsed", function() {
            const parser = new ChessNLP();

            expect(() => parser.toSAN('foo')).to.throw('Invalid move: foo');
        });

    });

});
