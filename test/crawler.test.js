/* global describe, it, before */
import {expect} from 'chai';
import Crawler from '../src/lib/crawler';
import {error} from '../src/lib/utils/log';

describe('Crawler', function() {
    const c = new Crawler();
    let results;

    before(function(done) {
        c
            .search('cross spawn')
            .then(res => {
                results = res;
                done();
            })
            .catch(err => {
                error(err);
            });
    });

    it('Results should be an Array', function() {
        expect(results).to.be.an('array');
    });

    it('Results should contain package name', function() {
        expect(results[0].name).to.exist;
    });

    it('Results should conatain package version', function() {
        expect(results[0].version).to.exist;
    });

    it('Results should conatain package description', function() {
        expect(results[0].description).to.exist;
    });

    it('Results should conatain package link', function() {
        expect(results[0].link).to.exist;
    });
});
