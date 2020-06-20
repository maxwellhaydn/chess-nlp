import { expect } from 'chai';

import ChessNLP from './index';

describe('ChessNLP', function() {

    describe('constructor', function() {

        it('should succeed with no arguments', function() {
            expect(() => new ChessNLP()).not.to.throw();
        });

        it('should accept an "aliases" option', function() {
            const parser = new ChessNLP({ aliases: 'foo' });

            expect(parser.aliases).to.equal('foo');
        });

    });

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
            ['rook a takes a3', 'Raxa3'],
            ['queen c 2 d 3', 'Qc2d3'],
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

    describe('aliases', function() {

        it.each([
            ['king', ['foo', 'bar'], 'bar takes c7', 'Kxc7'],
            ['queen', ['kween'], 'KwEen to A8', 'Qa8'],
            ['rook', ['Brooke', 'brook', 'hook'], 'brook A d6', 'Rad6'],
            ['bishop', ['foo', 'bar'], 'foo 2 e4', 'B2e4'],
            ['knight', ['night', 'nite'], 'Night captures b2 mate', 'Nxb2#'],
            ['a', ['alpha'], 'ALPHA takes b4', 'axb4'],
            ['b', ['beta', 'bravo'], 'rook bravo to beta7', 'Rbb7'],
            ['c', ['charlie'], 'charlie6', 'c6'],
            ['d', ['delta'], 'Queen captures DELTA1 checkmate', 'Qxd1#'],
            ['e', ['echo'], 'Echo5', 'e5'],
            ['f', ['foxtrot'], 'knight foxtrot 3', 'Nf3'],
            ['g', ['golf'], 'rook golf takes golf2', 'Rgxg2'],
            ['h', ['hotel', 'hey'], 'rook hey takes hotel 6', 'Rhxh6'],
        ])('%j aliases', (target, aliases, text, expected) => {
            const parser = new ChessNLP({ aliases: { [target]: aliases } });

            expect(parser.toSAN(text)).to.equal(expected);
        });

    });

});
