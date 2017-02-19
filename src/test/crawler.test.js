/* global describe, it, before */
import {expect} from 'chai';
import Crawler from '../src/lib/crawler';

describe('Crawler', function() {
    const c = new Crawler();
    let results;

    before(function() {
        c.search('cross spawn').then(res => results = res);
    });

    it('Results should be an Array', function() {
        expect(results).to.be.an('array');
    });
});
