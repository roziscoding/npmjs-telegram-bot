/* global describe, it, before */
import {expect} from 'chai';
import Crawler from '../src/lib/crawler';

describe('Crawler', function() {
    describe('Search', function() {
        const c = new Crawler();
        let results;

        before(function() {
            c.search('cross spawn').then(res => results = res);
        });

        it('Results should be an Array', function() {
            expect(results).to.be.an('array');
        });

        it('Results should contain package name', function() {
            expect(results.name).to.exist;
        });

        it('Results should contain package description', function() {
            expect(results.description).to.exist;
        });

        it('Results should contain package version', function() {
            expect(results.version).to.exist;
        });

        it('Results should contain package link', function() {
            expect(results.link).to.exist;
        });
    });

    describe('Most Starred', function() {
        const c = new Crawler();
        let results;

        before(function() {
            c.recommend().then(res => results = res);
        });

        it('Results should be an Array', function() {
            expect(results).to.be.an('array');
        });

        it('Results should contain package name', function() {
            expect(results.name).to.exist;
        });

        it('Results should contain package description', function() {
            expect(results.description).to.exist;
        });

        it('Results should contain package version', function() {
            expect(results.version).to.exist;
        });

        it('Results should contain package link', function() {
            expect(results.link).to.exist;
        });
    });
});
